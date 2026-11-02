-- Catalog taxonomy: academic departments and hierarchical book topics.

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null unique,
  sort_order integer not null default 0
);

create table if not exists public.book_topics (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.book_topics(id) on delete cascade,
  name text not null,
  slug text not null unique,
  sort_order integer not null default 0,
  unique (parent_id, name)
);

alter table public.departments enable row level security;
alter table public.book_topics enable row level security;

drop policy if exists "Catalog departments are public" on public.departments;
create policy "Catalog departments are public"
  on public.departments for select to public using (true);

drop policy if exists "Catalog topics are public" on public.book_topics;
create policy "Catalog topics are public"
  on public.book_topics for select to public using (true);

insert into public.departments (code, name, sort_order)
values
  ('TIK', 'Teknologi Informasi dan Komputer', 1),
  ('TE', 'Teknik Elektro', 2),
  ('TM', 'Teknik Mesin', 3),
  ('TK', 'Teknik Kimia', 4),
  ('TS', 'Teknik Sipil', 5),
  ('BIS', 'Bisnis', 6)
on conflict (code) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.book_topics (parent_id, name, slug, sort_order)
values
  (null, 'Filsafat', 'filsafat', 1),
  (null, 'Agama', 'agama', 2),
  (null, 'Ilmu-ilmu Sosial', 'ilmu-ilmu-sosial', 3),
  (null, 'Ilmu-ilmu Murni', 'ilmu-ilmu-murni', 4),
  (null, 'Ilmu-ilmu Terapan', 'ilmu-ilmu-terapan', 5),
  (null, 'Kesenian, Hiburan, dan Olahraga', 'kesenian-hiburan-olahraga', 6),
  (null, 'Kesusastraan', 'kesusastraan', 7),
  (null, 'Geografi dan Sejarah', 'geografi-sejarah', 8),
  (null, 'Bahasa', 'bahasa', 9)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.book_topics (parent_id, name, slug, sort_order)
select parent_topic.id, topic.name, topic.slug, topic.sort_order
from (values
  ('ilmu-ilmu-terapan', 'Teknologi Informasi dan Komputer', 'tik', 1),
  ('ilmu-ilmu-terapan', 'Teknik Elektro', 'teknik-elektro', 2),
  ('ilmu-ilmu-terapan', 'Teknik Mesin', 'teknik-mesin', 3),
  ('ilmu-ilmu-terapan', 'Teknik Kimia', 'teknik-kimia', 4),
  ('ilmu-ilmu-terapan', 'Teknik Sipil', 'teknik-sipil', 5),
  ('ilmu-ilmu-sosial', 'Manajemen', 'manajemen', 1),
  ('ilmu-ilmu-sosial', 'Akuntansi', 'akuntansi', 2),
  ('ilmu-ilmu-sosial', 'Ekonomi', 'ekonomi', 3),
  ('ilmu-ilmu-sosial', 'Kewirausahaan', 'kewirausahaan', 4),
  ('ilmu-ilmu-sosial', 'Manajemen Pemasaran', 'manajemen-pemasaran', 5),
  ('ilmu-ilmu-sosial', 'Manajemen Keuangan', 'manajemen-keuangan', 6),
  ('ilmu-ilmu-sosial', 'Manajemen Sumber Daya Manusia', 'manajemen-sdm', 7),
  ('ilmu-ilmu-sosial', 'Administrasi Bisnis', 'administrasi-bisnis', 8),
  ('ilmu-ilmu-sosial', 'Perdagangan Internasional', 'perdagangan-internasional', 9),
  ('ilmu-ilmu-sosial', 'Bisnis Digital', 'bisnis-digital', 10),
  ('filsafat', 'Etika', 'etika', 1),
  ('filsafat', 'Logika', 'logika', 2),
  ('filsafat', 'Filsafat Ilmu', 'filsafat-ilmu', 3),
  ('agama', 'Akidah', 'akidah', 1),
  ('agama', 'Fikih', 'fikih', 2),
  ('agama', 'Al-Qur''an dan Tafsir', 'alquran-tafsir', 3),
  ('agama', 'Studi Islam', 'studi-islam', 4),
  ('bahasa', 'Linguistik', 'linguistik', 1),
  ('bahasa', 'Tata Bahasa', 'tata-bahasa', 2),
  ('bahasa', 'Penerjemahan', 'penerjemahan', 3),
  ('kesusastraan', 'Sastra Indonesia', 'sastra-indonesia', 1),
  ('kesusastraan', 'Sastra Inggris', 'sastra-inggris', 2),
  ('kesusastraan', 'Kritik Sastra', 'kritik-sastra', 3),
  ('geografi-sejarah', 'Geografi Fisik', 'geografi-fisik', 1),
  ('geografi-sejarah', 'Sejarah Indonesia', 'sejarah-indonesia', 2),
  ('geografi-sejarah', 'Sejarah Dunia', 'sejarah-dunia', 3),
  ('ilmu-ilmu-murni', 'Matematika', 'matematika', 1),
  ('ilmu-ilmu-murni', 'Fisika', 'fisika', 2),
  ('ilmu-ilmu-murni', 'Kimia', 'kimia', 3),
  ('kesenian-hiburan-olahraga', 'Seni Rupa', 'seni-rupa', 1),
  ('kesenian-hiburan-olahraga', 'Musik', 'musik', 2),
  ('kesenian-hiburan-olahraga', 'Olahraga', 'olahraga', 3),
  ('kesenian-hiburan-olahraga', 'Film dan Fotografi', 'film-fotografi', 4),
  ('tik', 'Pemrograman', 'pemrograman', 1),
  ('tik', 'Pengembangan Web dan Mobile', 'pengembangan-web-mobile', 2),
  ('tik', 'Kecerdasan Buatan', 'kecerdasan-buatan', 3),
  ('tik', 'Keamanan Siber', 'keamanan-siber', 4),
  ('tik', 'Basis Data', 'basis-data', 5),
  ('tik', 'Jaringan Komputer', 'jaringan-komputer', 6),
  ('tik', 'Rekayasa Perangkat Lunak', 'rekayasa-perangkat-lunak', 7),
  ('tik', 'Internet of Things', 'internet-of-things', 8),
  ('tik', 'Cloud Computing', 'cloud-computing', 9),
  ('teknik-elektro', 'Elektronika', 'elektronika', 1),
  ('teknik-elektro', 'Sistem Tenaga Listrik', 'sistem-tenaga-listrik', 2),
  ('teknik-elektro', 'Sistem Kendali dan Otomasi', 'sistem-kendali-otomasi', 3),
  ('teknik-elektro', 'Telekomunikasi', 'telekomunikasi', 4),
  ('teknik-elektro', 'Mikrokontroler', 'mikrokontroler', 5),
  ('teknik-elektro', 'Robotika', 'robotika', 6),
  ('teknik-mesin', 'Mekanika Teknik', 'mekanika-teknik', 1),
  ('teknik-mesin', 'Termodinamika', 'termodinamika', 2),
  ('teknik-mesin', 'Perancangan Mesin', 'perancangan-mesin', 3),
  ('teknik-mesin', 'Teknologi Manufaktur', 'teknologi-manufaktur', 4),
  ('teknik-mesin', 'Mekanika Fluida', 'mekanika-fluida', 5),
  ('teknik-mesin', 'Otomotif', 'otomotif', 6),
  ('teknik-kimia', 'Proses Industri Kimia', 'proses-industri-kimia', 1),
  ('teknik-kimia', 'Termodinamika Kimia', 'termodinamika-kimia', 2),
  ('teknik-kimia', 'Teknik Reaksi Kimia', 'teknik-reaksi-kimia', 3),
  ('teknik-kimia', 'Operasi Teknik Kimia', 'operasi-teknik-kimia', 4),
  ('teknik-kimia', 'Perpindahan Panas dan Massa', 'perpindahan-panas-massa', 5),
  ('teknik-kimia', 'Teknologi Polimer', 'teknologi-polimer', 6),
  ('teknik-kimia', 'Pengolahan Limbah Industri', 'pengolahan-limbah-industri', 7),
  ('teknik-sipil', 'Struktur Bangunan', 'struktur-bangunan', 1),
  ('teknik-sipil', 'Teknik Geoteknik', 'teknik-geoteknik', 2),
  ('teknik-sipil', 'Teknik Transportasi', 'teknik-transportasi', 3),
  ('teknik-sipil', 'Hidrologi dan Sumber Daya Air', 'hidrologi-sda', 4),
  ('teknik-sipil', 'Manajemen Konstruksi', 'manajemen-konstruksi', 5),
  ('teknik-sipil', 'Teknologi Beton', 'teknologi-beton', 6),
  ('teknik-sipil', 'Material Konstruksi', 'material-konstruksi', 7),
  ('teknik-sipil', 'Survei dan Pemetaan', 'survei-pemetaan', 8)
) as topic(parent_slug, name, slug, sort_order)
join public.book_topics parent_topic on parent_topic.slug = topic.parent_slug
on conflict (slug) do update set
  parent_id = excluded.parent_id,
  name = excluded.name,
  sort_order = excluded.sort_order;

alter table public.books
  add column if not exists department_id uuid references public.departments(id),
  add column if not exists topic_id uuid references public.book_topics(id);

update public.books
set category = case
  when category in ('Teknik Informatika', 'Teknik Informatika (TIK)', 'TIK', 'Teknologi Informasi dan Komputer')
    then 'Teknologi Informasi dan Komputer'
  when category in ('Tata Niaga', 'Tata Niaga / Bisnis', 'Bisnis')
    then 'Bisnis'
  else category
end;

update public.books b
set department_id = d.id
from public.departments d
where b.department_id is null and d.name = b.category;

update public.books b
set topic_id = t.id
from public.book_topics t
where b.topic_id is null
  and t.slug = case
    when b.code like 'INF-%' then 'rekayasa-perangkat-lunak'
    when b.code in ('ELK-019', 'ELK-037') then 'sistem-kendali-otomasi'
    when b.code = 'ELK-022' then 'sistem-tenaga-listrik'
    when b.code in ('MES-005', 'MES-029') then 'termodinamika'
    when b.code = 'MES-018' then 'teknologi-manufaktur'
    when b.code in ('KIM-031', 'KIM-044') then 'proses-industri-kimia'
    when b.code = 'KIM-052' then 'pengolahan-limbah-industri'
    when b.code in ('SPL-014', 'SPL-033') then 'teknologi-beton'
    when b.code = 'AKT-012' then 'akuntansi'
    when b.code = 'TNI-027' then 'akuntansi'
    when b.code = 'TNI-041' then 'kewirausahaan'
    else 'ilmu-ilmu-terapan'
  end;

create index if not exists books_department_id_idx on public.books (department_id);
create index if not exists books_topic_id_idx on public.books (topic_id);
