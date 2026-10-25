-- ==============================================================================
-- SIPERPUS PNL (Politeknik Negeri Lhokseumawe) Database Schema
-- Following Supabase & Postgres Best Practices:
-- 1. Explicit RLS enabled on all tables in public schema
-- 2. TO authenticated / TO anon instead of deprecated auth.role()
-- 3. Row ownership checks with (select auth.uid()) = user_id
-- 4. UPDATE policies require BOTH using (...) AND with check (...)
-- 5. Role & authorization data stored in profiles table / app_metadata
-- ==============================================================================

-- 1. PROFILES (Extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nim text unique,
  full_name text not null,
  role text not null default 'student' check (role in ('student', 'librarian')),
  prodi text,
  avatar_url text,
  clear_status boolean not null default true, -- Bebas Pustaka
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by authenticated users"
  on public.profiles
  for select
  to authenticated
  using (true);

create policy "Users can update their own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- 2. BOOKS (Physical catalog)
create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  title text not null,
  author text not null,
  category text not null,
  year int not null,
  stock int not null default 1 check (stock >= 0),
  shelf text not null,
  cover_url text,
  available boolean generated always as (stock > 0) stored,
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

create policy "Books are viewable by everyone"
  on public.books
  for select
  to public
  using (true);

create policy "Librarians can insert books"
  on public.books
  for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

create policy "Librarians can update books"
  on public.books
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

create policy "Librarians can delete books"
  on public.books
  for delete
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

-- 3. HOLDS (Reservations)
create table if not exists public.holds (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete restrict,
  pin text not null,
  status text not null default 'active' check (status in ('active', 'collected', 'expired', 'cancelled')),
  expires_at timestamptz not null default (now() + interval '2 days'),
  created_at timestamptz not null default now()
);

alter table public.holds enable row level security;

create policy "Users can view their own holds"
  on public.holds
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id or
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

create policy "Students can reserve books"
  on public.holds
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Hold update allowed by student owner or librarian"
  on public.holds
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id or
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  )
  with check (
    (select auth.uid()) = user_id or
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

-- 4. LOANS (Active borrowings & history)
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  book_id uuid not null references public.books(id) on delete restrict,
  borrowed_at timestamptz not null default now(),
  due_date timestamptz not null default (now() + interval '14 days'),
  returned_at timestamptz,
  status text not null default 'borrowed' check (status in ('borrowed', 'returned', 'overdue')),
  created_at timestamptz not null default now()
);

alter table public.loans enable row level security;

create policy "Users can view their own loans or librarians can view all"
  on public.loans
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id or
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

create policy "Librarians can insert and update loans"
  on public.loans
  for all
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

-- 5. FINES (Overdue fines and QRIS payment verification)
create table if not exists public.fines (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  loan_id uuid references public.loans(id) on delete set null,
  amount bigint not null check (amount >= 0),
  days_late int not null default 0,
  status text not null default 'unpaid' check (status in ('unpaid', 'pending_verification', 'paid')),
  receipt_url text, -- proof of QRIS payment uploaded to storage
  verified_at timestamptz,
  verified_by uuid references public.profiles(id),
  rejection_note text,
  created_at timestamptz not null default now()
);

alter table public.fines enable row level security;

create policy "Users can view their own fines or librarians view all"
  on public.fines
  for select
  to authenticated
  using (
    (select auth.uid()) = user_id or
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

create policy "Users can update fine receipt for verification"
  on public.fines
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Librarians can manage all fines"
  on public.fines
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

-- 6. REPOSITORY_ITEMS (Theses, capstone, journals)
create table if not exists public.repository_items (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  prodi text not null,
  year int not null,
  abstract text not null,
  pdf_url text,
  file_name text,
  file_size text,
  status text not null default 'pending_curation' check (status in ('pending_curation', 'published', 'revision_needed')),
  reviewer_notes text,
  downloads_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.repository_items enable row level security;

create policy "Published repo items viewable by everyone"
  on public.repository_items
  for select
  to public
  using (
    status = 'published' or
    (select auth.uid()) = author_id or
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

create policy "Students can submit repository items"
  on public.repository_items
  for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

create policy "Authors can update pending items"
  on public.repository_items
  for update
  to authenticated
  using ((select auth.uid()) = author_id)
  with check ((select auth.uid()) = author_id);

create policy "Librarians can curate repository items"
  on public.repository_items
  for update
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  )
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = (select auth.uid()) and profiles.role = 'librarian'
    )
  );

-- 7. AUTOMATIC USER PROFILE TRIGGER
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
    coalesce(new.raw_user_meta_data->>'nim', null),
    coalesce(new.raw_user_meta_data->>'full_name', 'Mahasiswa PNL'),
    coalesce(new.raw_app_meta_data->>'role', coalesce(new.raw_user_meta_data->>'role', 'student')),
    coalesce(new.raw_user_meta_data->>'prodi', 'Teknologi Informasi & Komputer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 8. STORAGE BUCKETS (run in SQL editor)
-- insert into storage.buckets (id, name, public) values ('qris-receipts', 'qris-receipts', false);
-- insert into storage.buckets (id, name, public) values ('repository-files', 'repository-files', true);
