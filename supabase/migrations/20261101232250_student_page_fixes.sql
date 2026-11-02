-- Student circulation and E-Repository fixes.
-- Run after 001_fixes.sql.

create extension if not exists pg_cron;

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
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  perform public.expire_holds();
  select * into selected_book
  from public.books
  where id = book_id
  for update;

  if not found then
    raise exception 'Book not found';
  end if;
  if selected_book.stock <= 0 then
    raise exception 'Book is unavailable';
  end if;
  if exists (
    select 1
    from public.holds
    where user_id = current_user_id
      and public.holds.book_id = reserve_book.book_id
      and status = 'active'
  ) then
    raise exception 'You already have an active hold for this book';
  end if;

  update public.books
  set stock = stock - 1
  where id = book_id;

  loop
    generated_pin := 'PNL-HOLD-' || upper(
      substr(
        pg_catalog.md5(
          current_user_id::text
          || pg_catalog.clock_timestamp()::text
          || pg_catalog.random()::text
        ),
        1,
        4
      )
    );
    exit when not exists (
      select 1 from public.holds where pin = generated_pin
    );
  end loop;

  insert into public.holds (user_id, book_id, pin, expires_at)
  values (current_user_id, book_id, generated_pin, now() + interval '3 days')
  returning * into created_hold;
  return created_hold;
end;
$$;

revoke all on function public.reserve_book(uuid) from public, anon;
grant execute on function public.reserve_book(uuid) to authenticated;

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
  if not public.is_librarian() then
    raise exception 'Librarian access required';
  end if;

  perform public.expire_holds();
  select * into selected_hold
  from public.holds
  where id = hold_id
  for update;
  if not found or selected_hold.status <> 'active' then
    raise exception 'Active hold not found';
  end if;

  update public.holds
  set status = 'collected'
  where id = hold_id;
  insert into public.loans (user_id, book_id, borrowed_at, due_date, status)
  values (selected_hold.user_id, selected_hold.book_id, now(), now() + interval '14 days', 'borrowed')
  returning * into created_loan;
  return created_loan;
end;
$$;

revoke all on function public.handover_hold(uuid) from public, anon;
grant execute on function public.handover_hold(uuid) to authenticated;

alter table public.holds
  alter column expires_at set default (now() + interval '3 days');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('qris-receipts', 'qris-receipts', false, 10485760, array['image/*', 'application/pdf']),
  ('repository-files', 'repository-files', false, 10485760, array['application/pdf'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

do $$
begin
  if not exists (
    select 1 from cron.job where jobname = 'expire-library-holds'
  ) then
    perform cron.schedule(
      'expire-library-holds',
      '*/15 * * * *',
      'select public.expire_holds();'
    );
  end if;
end
$$;