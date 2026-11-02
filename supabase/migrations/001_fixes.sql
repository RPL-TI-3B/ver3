-- SIPERPUS security, circulation and storage fixes.
-- Run after supabase/schema.sql.

create extension if not exists pgcrypto;

alter table public.repository_items
  add column if not exists category text not null default 'nonfiction'
    check (category in ('nonfiction', 'fiction')),
  add column if not exists type text not null default 'Karya Ilmiah',
  add column if not exists author_name text;

alter table public.holds
  alter column expires_at set default (now() + interval '3 days');

create table if not exists public.downloads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  repository_item_id uuid not null references public.repository_items(id) on delete cascade,
  downloaded_at timestamptz not null default now()
);

create or replace function public.record_download(item_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.uid()) is null then raise exception 'Authentication required'; end if;
  if not exists (select 1 from public.repository_items where id = item_id and status = 'published') then
    raise exception 'Published repository item not found';
  end if;
  insert into public.downloads (user_id, repository_item_id)
  values ((select auth.uid()), item_id);
  update public.repository_items set downloads_count = downloads_count + 1 where id = item_id;
end;
$$;
revoke all on function public.record_download(uuid) from public, anon;
grant execute on function public.record_download(uuid) to authenticated;

alter table public.downloads enable row level security;
drop policy if exists "Users can view their own downloads" on public.downloads;
drop policy if exists "Users can create their own downloads" on public.downloads;
create policy "Users can view their own downloads"
  on public.downloads for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can create their own downloads"
  on public.downloads for insert to authenticated
  with check ((select auth.uid()) = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, nim, full_name, role, prodi)
  values (
    new.id,
    new.raw_user_meta_data->>'nim',
    coalesce(new.raw_user_meta_data->>'full_name', 'Mahasiswa PNL'),
    coalesce(new.raw_app_meta_data->>'role', 'student'),
    coalesce(new.raw_user_meta_data->>'prodi', 'Teknologi Informasi & Komputer')
  )
  on conflict (id) do update set
    nim = excluded.nim,
    full_name = excluded.full_name,
    prodi = excluded.prodi;
  return new;
end;
$$;

create or replace function public.protect_profile_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (select auth.uid()) = old.id
     and (old.full_name, old.avatar_url) is distinct from (new.full_name, new.avatar_url)
     and (old.nim, old.role, old.prodi, old.clear_status) is distinct from
         (new.nim, new.role, new.prodi, new.clear_status) then
    raise exception 'Students may only update full_name and avatar_url';
  end if;
  if (select auth.uid()) = old.id
     and (old.nim, old.role, old.prodi, old.clear_status) is distinct from
         (new.nim, new.role, new.prodi, new.clear_status) then
    raise exception 'Students may only update full_name and avatar_url';
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_update on public.profiles;
create trigger protect_profile_update
  before update on public.profiles
  for each row execute procedure public.protect_profile_update();

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

drop policy if exists "Users can update fine receipt for verification" on public.fines;
create policy "Users can update fine receipt for verification"
  on public.fines for update to authenticated
  using ((select auth.uid()) = user_id)
  with check (
    (select auth.uid()) = user_id
    and status = 'pending_verification'
    and receipt_url is not null
    and status is distinct from 'paid'
  );

create or replace function public.is_librarian()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'librarian'
  );
$$;

create or replace function public.expire_holds()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  expired_count integer := 0;
  expired_hold public.holds;
begin
  for expired_hold in
    select * from public.holds
    where status = 'active' and expires_at <= now()
    for update
  loop
    update public.holds set status = 'expired' where id = expired_hold.id;
    update public.books set stock = stock + 1 where id = expired_hold.book_id;
    expired_count := expired_count + 1;
  end loop;
  return expired_count;
end;
$$;

create or replace function public.reserve_book(book_id uuid)
returns public.holds
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  selected_book public.books;
  created_hold public.holds;
  generated_pin text;
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  perform public.expire_holds();
  select * into selected_book from public.books where id = book_id for update;
  if not found then raise exception 'Book not found'; end if;
  if selected_book.stock <= 0 then raise exception 'Book is unavailable'; end if;
  if exists (
    select 1 from public.holds
    where user_id = current_user_id and public.holds.book_id = reserve_book.book_id and status = 'active'
  ) then raise exception 'You already have an active hold for this book'; end if;

  update public.books set stock = stock - 1 where id = book_id;
  loop
    generated_pin := 'PNL-HOLD-' || upper(substr(
      pg_catalog.md5(
        current_user_id::text
        || pg_catalog.clock_timestamp()::text
        || pg_catalog.random()::text
      ),
      1,
      4
    ));
    exit when not exists (select 1 from public.holds where pin = generated_pin);
  end loop;
  insert into public.holds (user_id, book_id, pin, expires_at)
  values (current_user_id, book_id, generated_pin, now() + interval '3 days')
  returning * into created_hold;
  return created_hold;
end;
$$;

create or replace function public.handover_hold(hold_id uuid)
returns public.loans
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_hold public.holds;
  created_loan public.loans;
begin
  if not public.is_librarian() then raise exception 'Librarian access required'; end if;
  select * into selected_hold from public.holds where id = hold_id for update;
  if not found or selected_hold.status <> 'active' then raise exception 'Active hold not found'; end if;
  update public.holds set status = 'collected' where id = hold_id;
  insert into public.loans (user_id, book_id, borrowed_at, due_date, status)
  values (selected_hold.user_id, selected_hold.book_id, now(), now() + interval '14 days', 'borrowed')
  returning * into created_loan;
  return created_loan;
end;
$$;

create or replace function public.return_loan(loan_id uuid)
returns public.loans
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_loan public.loans;
  late_days integer;
  returned_loan public.loans;
begin
  if not public.is_librarian() then raise exception 'Librarian access required'; end if;
  select * into selected_loan from public.loans where id = loan_id for update;
  if not found or selected_loan.returned_at is not null then raise exception 'Active loan not found'; end if;
  late_days := greatest(0, floor(extract(epoch from (now() - selected_loan.due_date)) / 86400)::integer);
  update public.loans
    set returned_at = now(), status = 'returned'
    where id = loan_id
    returning * into returned_loan;
  update public.books set stock = stock + 1 where id = selected_loan.book_id;
  if late_days > 0 then
    insert into public.fines (user_id, loan_id, amount, days_late)
    values (selected_loan.user_id, selected_loan.id, late_days * 1000, late_days);
    update public.profiles set clear_status = false where id = selected_loan.user_id;
  end if;
  return returned_loan;
end;
$$;

create or replace function public.refresh_clear_status(target_user_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.profiles
  set clear_status = not exists (
    select 1 from public.fines
    where user_id = target_user_id and status <> 'paid'
  )
  where id = target_user_id;
$$;

create or replace function public.approve_fine(fine_id uuid)
returns public.fines
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_fine public.fines;
begin
  if not public.is_librarian() then raise exception 'Librarian access required'; end if;
  update public.fines
  set status = 'paid', verified_at = now(), verified_by = (select auth.uid()), rejection_note = null
  where id = fine_id and status = 'pending_verification'
  returning * into selected_fine;
  if not found then raise exception 'Fine is not awaiting verification'; end if;
  perform public.refresh_clear_status(selected_fine.user_id);
  return selected_fine;
end;
$$;

create or replace function public.reject_fine(fine_id uuid, note text)
returns public.fines
language plpgsql
security definer
set search_path = ''
as $$
declare
  updated_fine public.fines;
begin
  if not public.is_librarian() then raise exception 'Librarian access required'; end if;
  update public.fines
  set status = 'unpaid', rejection_note = nullif(trim(note), ''), verified_at = null, verified_by = null
  where id = fine_id and status = 'pending_verification'
  returning * into updated_fine;
  if not found then raise exception 'Fine is not awaiting verification'; end if;
  return updated_fine;
end;
$$;

create or replace function public.expire_holds()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  expired_count integer := 0;
  expired_hold public.holds;
begin
  for expired_hold in
    select * from public.holds
    where status = 'active' and expires_at <= now()
    for update
  loop
    update public.holds set status = 'expired' where id = expired_hold.id;
    update public.books set stock = stock + 1 where id = expired_hold.book_id;
    expired_count := expired_count + 1;
  end loop;
  return expired_count;
end;
$$;

create or replace function public.lookup_librarian(identifier text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_profile public.profiles;
begin
  if not public.is_librarian() then raise exception 'Librarian access required'; end if;
  perform public.expire_holds();
  select * into target_profile
  from public.profiles
  where upper(nim) = upper(trim(identifier))
  limit 1;
  if not found then
    select p.* into target_profile
    from public.profiles p
    join public.holds h on h.user_id = p.id
    where upper(h.pin) = upper(trim(identifier))
    order by h.created_at desc
    limit 1;
  end if;
  if not found then return null; end if;
  return jsonb_build_object(
    'profile', to_jsonb(target_profile),
    'holds', coalesce((select jsonb_agg(to_jsonb(h) || jsonb_build_object('book', to_jsonb(b)))
      from public.holds h join public.books b on b.id = h.book_id
      where h.user_id = target_profile.id), '[]'::jsonb),
    'loans', coalesce((select jsonb_agg(to_jsonb(l) || jsonb_build_object('book', to_jsonb(b)))
      from public.loans l join public.books b on b.id = l.book_id
      where l.user_id = target_profile.id), '[]'::jsonb),
    'fines', coalesce((select jsonb_agg(to_jsonb(f)) from public.fines f where f.user_id = target_profile.id), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.reserve_book(uuid) from public, anon;
revoke all on function public.handover_hold(uuid) from public, anon;
revoke all on function public.return_loan(uuid) from public, anon;
revoke all on function public.approve_fine(uuid) from public, anon;
revoke all on function public.reject_fine(uuid, text) from public, anon;
revoke all on function public.expire_holds() from public, anon, authenticated;
grant execute on function public.reserve_book(uuid) to authenticated;
grant execute on function public.handover_hold(uuid) to authenticated;
grant execute on function public.return_loan(uuid) to authenticated;
grant execute on function public.approve_fine(uuid) to authenticated;
grant execute on function public.reject_fine(uuid, text) to authenticated;
grant execute on function public.lookup_librarian(text) to authenticated;

insert into storage.buckets (id, name, public)
values ('qris-receipts', 'qris-receipts', false), ('repository-files', 'repository-files', false)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Students upload own QRIS receipts" on storage.objects;
create policy "Students upload own QRIS receipts"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'qris-receipts' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Students read own QRIS receipts" on storage.objects;
create policy "Students read own QRIS receipts"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'qris-receipts'
    and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_librarian())
  );
drop policy if exists "Students upload own repository files" on storage.objects;
create policy "Students upload own repository files"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'repository-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Authenticated read repository files" on storage.objects;
create policy "Authenticated read repository files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'repository-files'
    and (
      public.is_librarian()
      or (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (
        select 1
        from public.repository_items ri
        where ri.status = 'published'
          and ri.pdf_url = name
      )
    )
  );
