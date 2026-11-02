-- Initial Seed Data for Siperpus
insert into public.departments (code, name, sort_order)
values
  ('TIK', 'Teknologi Informasi dan Komputer', 1),
  ('TE', 'Teknik Elektro', 2),
  ('TM', 'Teknik Mesin', 3),
  ('TK', 'Teknik Kimia', 4),
  ('TS', 'Teknik Sipil', 5),
  ('BIS', 'Bisnis', 6)
on conflict (code) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.book_topics (name, slug, sort_order)
values
  ('Filsafat', 'filsafat', 1),
  ('Agama', 'agama', 2),
  ('Ilmu-ilmu Sosial', 'ilmu-ilmu-sosial', 3),
  ('Ilmu-ilmu Murni', 'ilmu-ilmu-murni', 4),
  ('Ilmu-ilmu Terapan', 'ilmu-ilmu-terapan', 5),
  ('Kesenian, Hiburan, dan Olahraga', 'kesenian-hiburan-olahraga', 6),
  ('Kesusastraan', 'kesusastraan', 7),
  ('Geografi dan Sejarah', 'geografi-sejarah', 8),
  ('Bahasa', 'bahasa', 9)
on conflict (slug) do update set name = excluded.name, sort_order = excluded.sort_order;

insert into public.book_topics (parent_id, name, slug, sort_order)
select parent.id, child.name, child.slug, child.sort_order
from (values
  ('ilmu-ilmu-terapan', 'Teknologi Informasi dan Komputer', 'tik', 1),
  ('ilmu-ilmu-terapan', 'Teknik Elektro', 'teknik-elektro', 2),
  ('ilmu-ilmu-terapan', 'Teknik Mesin', 'teknik-mesin', 3),
  ('ilmu-ilmu-terapan', 'Teknik Kimia', 'teknik-kimia', 4),
  ('ilmu-ilmu-terapan', 'Teknik Sipil', 'teknik-sipil', 5),
  ('ilmu-ilmu-sosial', 'Akuntansi', 'akuntansi', 1),
  ('ilmu-ilmu-sosial', 'Kewirausahaan', 'kewirausahaan', 2),
  ('ilmu-ilmu-sosial', 'Bisnis Digital', 'bisnis-digital', 3),
  ('filsafat', 'Filsafat Ilmu', 'filsafat-ilmu', 1),
  ('agama', 'Studi Islam', 'studi-islam', 1),
  ('bahasa', 'Linguistik', 'linguistik', 1),
  ('kesusastraan', 'Sastra Indonesia', 'sastra-indonesia', 1),
  ('geografi-sejarah', 'Sejarah Indonesia', 'sejarah-indonesia', 1),
  ('tik', 'Pemrograman', 'pemrograman', 1),
  ('tik', 'Basis Data', 'basis-data', 2),
  ('tik', 'Rekayasa Perangkat Lunak', 'rekayasa-perangkat-lunak', 3),
  ('teknik-elektro', 'Elektronika', 'elektronika', 1),
  ('teknik-elektro', 'Sistem Tenaga Listrik', 'sistem-tenaga-listrik', 2),
  ('teknik-mesin', 'Termodinamika', 'termodinamika', 1),
  ('teknik-mesin', 'Teknologi Manufaktur', 'teknologi-manufaktur', 2),
  ('teknik-kimia', 'Proses Industri Kimia', 'proses-industri-kimia', 1),
  ('teknik-kimia', 'Pengolahan Limbah Industri', 'pengolahan-limbah-industri', 2),
  ('teknik-sipil', 'Teknologi Beton', 'teknologi-beton', 1),
  ('teknik-sipil', 'Manajemen Konstruksi', 'manajemen-konstruksi', 2)
) as child(parent_slug, name, slug, sort_order)
join public.book_topics parent on parent.slug = child.parent_slug
on conflict (slug) do update set parent_id = excluded.parent_id, name = excluded.name, sort_order = excluded.sort_order;

-- Complete the general-science and arts branches when this seed is run
-- against a database created before the taxonomy was expanded.
insert into public.book_topics (parent_id, name, slug, sort_order)
select parent.id, child.name, child.slug, child.sort_order
from (values
  ('ilmu-ilmu-murni', 'Matematika', 'matematika', 1),
  ('ilmu-ilmu-murni', 'Fisika', 'fisika', 2),
  ('ilmu-ilmu-murni', 'Kimia', 'kimia', 3),
  ('kesenian-hiburan-olahraga', 'Seni Rupa', 'seni-rupa', 1),
  ('kesenian-hiburan-olahraga', 'Musik', 'musik', 2),
  ('kesenian-hiburan-olahraga', 'Olahraga', 'olahraga', 3),
  ('kesenian-hiburan-olahraga', 'Film dan Fotografi', 'film-fotografi', 4)
) as child(parent_slug, name, slug, sort_order)
join public.book_topics parent on parent.slug = child.parent_slug
on conflict (slug) do update set parent_id = excluded.parent_id, name = excluded.name, sort_order = excluded.sort_order;

update public.books set category = 'Teknologi Informasi dan Komputer'
where category in ('Teknik Informatika', 'Teknik Informatika (TIK)', 'TIK');
update public.books set category = 'Bisnis'
where category in ('Tata Niaga', 'Tata Niaga / Bisnis');

insert into public.books (code, title, author, category, year, stock, shelf, cover_url)
values
  ('INF-042', 'Rekayasa Perangkat Lunak Terapan', 'Dr. Ir. Hamdani, M.T.', 'Teknologi Informasi dan Komputer', 2023, 4, 'Rak A-03', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=400&q=80'),
  ('INF-088', 'Desain Antarmuka & Pengalaman Pengguna Berbasis AI', 'Siti Rahmah, S.Kom., M.Sc.', 'Teknologi Informasi dan Komputer', 2024, 2, 'Rak A-05', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'),
  ('ELK-019', 'Sistem Kendali PLC Berbasis IoT Industri 4.0', 'Ir. Teuku Ridwan, M.Eng.', 'Teknik Elektro', 2022, 0, 'Rak B-01', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80'),
  ('MES-005', 'Termodinamika Terapan untuk Industri Migas', 'Prof. Mukhlis, Ph.D.', 'Teknik Mesin', 2021, 5, 'Rak C-02', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80'),
  ('KIM-031', 'Teknologi Pengolahan Petrokimia Terpadu', 'Dr. Cut Maryam, S.T., M.Sc.', 'Teknik Kimia', 2023, 3, 'Rak D-04', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80'),
  ('AKT-012', 'Akuntansi Forensik Sektor Publik & Perpajakan', 'Zulfikar, S.E., M.Si., Ak.', 'Bisnis', 2024, 6, 'Rak E-01', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80')
  ,('SPL-014', 'Struktur Beton Bertulang', 'Prof. H. Sunggono', 'Teknik Sipil', 2022, 3, 'Rak B-02', null)
  ,('ELK-022', 'Dasar Teknik Tenaga Listrik', 'Zuhal', 'Teknik Elektro', 2021, 4, 'Rak B-06', null)
  ,('MES-018', 'Teknologi Manufaktur', 'Sriati Djaprie', 'Teknik Mesin', 2020, 2, 'Rak C-04', null)
  ,('KIM-044', 'Proses Kimia Industri', 'Dr. Cut Maryam', 'Teknik Kimia', 2023, 2, 'Rak D-06', null)
  ,('TNI-027', 'Akuntansi Manajemen', 'Mulyadi', 'Bisnis', 2022, 5, 'Rak E-03', null)
  ,('INF-101', 'Basis Data Relasional', 'Rosa A.S.', 'Teknologi Informasi dan Komputer', 2024, 3, 'Rak A-07', null)
  ,('SPL-033', 'Manajemen Proyek Konstruksi', 'Ervianto', 'Teknik Sipil', 2021, 2, 'Rak B-03', null)
  ,('ELK-037', 'Elektronika Daya', 'M. Rashid', 'Teknik Elektro', 2020, 1, 'Rak B-08', null)
  ,('MES-029', 'Mesin Konversi Energi', 'Wiranto Arismunandar', 'Teknik Mesin', 2019, 2, 'Rak C-07', null)
  ,('KIM-052', 'Keselamatan Proses Industri', 'Crowl & Louvar', 'Teknik Kimia', 2022, 3, 'Rak D-08', null)
  ,('TNI-041', 'Kewirausahaan Teknologi', 'Suryana', 'Bisnis', 2024, 4, 'Rak E-05', null)
  ,('INF-115', 'Pemrograman Web Modern', 'Hendrawan', 'Teknologi Informasi dan Komputer', 2025, 2, 'Rak A-09', null)
on conflict (code) do nothing;

update public.books b
set department_id = d.id
from public.departments d
where d.name = b.category;

update public.books b
set topic_id = t.id
from public.book_topics t
where t.slug = case
  when b.code like 'INF-%' then 'rekayasa-perangkat-lunak'
  when b.code in ('ELK-019', 'ELK-037') then 'sistem-kendali-otomasi'
  when b.code = 'ELK-022' then 'sistem-tenaga-listrik'
  when b.code in ('MES-005', 'MES-029') then 'termodinamika'
  when b.code = 'MES-018' then 'teknologi-manufaktur'
  when b.code in ('KIM-031', 'KIM-044') then 'proses-industri-kimia'
  when b.code = 'KIM-052' then 'pengolahan-limbah-industri'
  when b.code in ('SPL-014', 'SPL-033') then 'teknologi-beton'
  when b.code in ('AKT-012', 'TNI-027') then 'akuntansi'
  when b.code = 'TNI-041' then 'kewirausahaan'
  else 'ilmu-ilmu-terapan'
end;

-- Comprehensive catalog: two distinct, topic-specific synthetic records per
-- leaf topic. Codes make this block idempotent and safe to rerun.
do $$
declare
  topic_row record;
  department_uuid uuid;
  department_name text;
  code_one text;
  code_two text;
begin
  for topic_row in
    select child.id, child.slug, child.name, parent.slug as parent_slug
    from public.book_topics child
    join public.book_topics parent on parent.id = child.parent_id
    order by parent.sort_order, child.sort_order
  loop
    department_name := case topic_row.parent_slug
      when 'tik' then 'Teknologi Informasi dan Komputer'
      when 'teknik-elektro' then 'Teknik Elektro'
      when 'teknik-mesin' then 'Teknik Mesin'
      when 'teknik-kimia' then 'Teknik Kimia'
      when 'teknik-sipil' then 'Teknik Sipil'
      when 'ilmu-ilmu-terapan' then case topic_row.slug
        when 'tik' then 'Teknologi Informasi dan Komputer'
        when 'teknik-elektro' then 'Teknik Elektro'
        when 'teknik-mesin' then 'Teknik Mesin'
        when 'teknik-kimia' then 'Teknik Kimia'
        when 'teknik-sipil' then 'Teknik Sipil'
        else null
      end
      else null
    end;

    select id into department_uuid
    from public.departments
    where name = department_name;

    code_one := 'CAT-' || topic_row.slug || '-01';
    code_two := 'CAT-' || topic_row.slug || '-02';

    insert into public.books (
      code, title, author, category, department_id, topic_id, year,
      stock, shelf, cover_url
    )
    values (
      code_one,
      'Dasar ' || topic_row.name,
      case topic_row.slug
        when 'pemrograman' then 'Budi Raharjo'
        when 'keamanan-siber' then 'Stallings dan Brown'
        when 'sistem-kendali-otomasi' then 'Katsuhiko Ogata'
        when 'struktur-bangunan' then 'Wang dan Salmon'
        when 'manajemen-pemasaran' then 'Philip Kotler'
        when 'filsafat-ilmu' then 'Jujun S. Suriasumantri'
        when 'sejarah-indonesia' then 'M.C. Ricklefs'
        else 'Tim Koleksi Akademik PNL'
      end,
      coalesce(department_name, 'Koleksi Umum'),
      department_uuid,
      topic_row.id,
      2019 + (abs(hashtext(topic_row.slug)) % 7),
      2 + (abs(hashtext(topic_row.slug)) % 5),
      case
        when department_name = 'Teknologi Informasi dan Komputer' then 'Rak TIK-' || lpad((abs(hashtext(topic_row.slug)) % 20 + 1)::text, 2, '0')
        when department_name = 'Teknik Elektro' then 'Rak TE-' || lpad((abs(hashtext(topic_row.slug)) % 20 + 1)::text, 2, '0')
        when department_name = 'Teknik Mesin' then 'Rak TM-' || lpad((abs(hashtext(topic_row.slug)) % 20 + 1)::text, 2, '0')
        when department_name = 'Teknik Kimia' then 'Rak TK-' || lpad((abs(hashtext(topic_row.slug)) % 20 + 1)::text, 2, '0')
        when department_name = 'Teknik Sipil' then 'Rak TS-' || lpad((abs(hashtext(topic_row.slug)) % 20 + 1)::text, 2, '0')
        else 'Rak UM-' || lpad((abs(hashtext(topic_row.slug)) % 20 + 1)::text, 2, '0')
      end,
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80'
    )
    on conflict (code) do nothing;

    insert into public.books (
      code, title, author, category, department_id, topic_id, year,
      stock, shelf, cover_url
    )
    values (
      code_two,
      'Praktik dan Studi Kasus ' || topic_row.name,
      case topic_row.slug
        when 'basis-data' then 'Abraham Silberschatz'
        when 'jaringan-komputer' then 'Andrew S. Tanenbaum'
        when 'robotika' then 'Bruno Siciliano'
        when 'termodinamika' then 'Yunus A. Cengel'
        when 'teknologi-beton' then 'Nawy dan Winter'
        when 'akuntansi' then 'Mulyadi'
        when 'bisnis-digital' then 'Dave Chaffey'
        else 'Tim Koleksi Akademik PNL'
      end,
      coalesce(department_name, 'Koleksi Umum'),
      department_uuid,
      topic_row.id,
      2020 + (abs(hashtext(topic_row.slug || '-02')) % 6),
      1 + (abs(hashtext(topic_row.slug || '-02')) % 6),
      case
        when department_name = 'Teknologi Informasi dan Komputer' then 'Rak TIK-' || lpad((abs(hashtext(topic_row.slug || '-02')) % 20 + 1)::text, 2, '0')
        when department_name = 'Teknik Elektro' then 'Rak TE-' || lpad((abs(hashtext(topic_row.slug || '-02')) % 20 + 1)::text, 2, '0')
        when department_name = 'Teknik Mesin' then 'Rak TM-' || lpad((abs(hashtext(topic_row.slug || '-02')) % 20 + 1)::text, 2, '0')
        when department_name = 'Teknik Kimia' then 'Rak TK-' || lpad((abs(hashtext(topic_row.slug || '-02')) % 20 + 1)::text, 2, '0')
        when department_name = 'Teknik Sipil' then 'Rak TS-' || lpad((abs(hashtext(topic_row.slug || '-02')) % 20 + 1)::text, 2, '0')
        else 'Rak UM-' || lpad((abs(hashtext(topic_row.slug || '-02')) % 20 + 1)::text, 2, '0')
      end,
      'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=400&q=80'
    )
    on conflict (code) do nothing;
  end loop;
end $$;

-- Repair/reapply the foreign-key relation for generated records. The slug in
-- each deterministic code is the source of truth, so rerunning the seed also
-- corrects records created by an earlier seed version.
update public.books b
set topic_id = t.id
from public.book_topics t
where b.code like 'CAT-%'
  and t.slug = regexp_replace(b.code, '^CAT-(.*)-(01|02)$', '\1');

update public.books b
set department_id = d.id
from public.departments d
cross join public.book_topics t
join public.book_topics parent on parent.id = t.parent_id
where b.code like 'CAT-%'
  and t.id = b.topic_id
  and d.name = case
    when t.slug = 'tik' or parent.slug = 'tik' then 'Teknologi Informasi dan Komputer'
    when t.slug = 'teknik-elektro' or parent.slug = 'teknik-elektro' then 'Teknik Elektro'
    when t.slug = 'teknik-mesin' or parent.slug = 'teknik-mesin' then 'Teknik Mesin'
    when t.slug = 'teknik-kimia' or parent.slug = 'teknik-kimia' then 'Teknik Kimia'
    when t.slug = 'teknik-sipil' or parent.slug = 'teknik-sipil' then 'Teknik Sipil'
    else null
  end;

insert into public.repository_items (author_id, title, author_name, prodi, year, abstract, category, type, status, pdf_url, file_name, file_size)
select p.id, x.title, x.author_name, x.prodi, x.year, x.abstract, x.category, x.type, 'published', x.file_name, split_part(x.file_name, '/', 2), x.file_size
from (values
  ('Implementasi Sistem Monitoring Jaringan Berbasis IoT', 'Muhammad Fajri', 'Teknologi Informasi dan Komputer', 2025, 'Implementasi monitoring jaringan laboratorium.', 'nonfiction', 'Laporan Magang', 'demo/implementasi-monitoring-jaringan-iot.pdf', '4.2 MB'),
  ('Analisis Kuat Tekan Beton Menggunakan Abu Sekam', 'Nurul Aini', 'Teknik Sipil', 2024, 'Analisis material beton berkelanjutan.', 'nonfiction', 'Makalah', 'demo/analisis-kuat-tekan-beton.pdf', '7.8 MB'),
  ('Senja di Pelabuhan Krueng Geukueh', 'Cut Nabila', 'Bisnis', 2025, 'Cerita pendek berlatar Aceh Utara.', 'fiction', 'Cerpen', 'demo/senja-di-pelabuhan-krueng-geukueh.pdf', '2.4 MB')
) as x(title, author_name, prodi, year, abstract, category, type, file_name, file_size)
cross join lateral (select id from public.profiles order by created_at limit 1) p
where not exists (select 1 from public.repository_items r where r.title = x.title);

update public.repository_items
set pdf_url = case title
  when 'Implementasi Sistem Monitoring Jaringan Berbasis IoT' then 'demo/implementasi-monitoring-jaringan-iot.pdf'
  when 'Analisis Kuat Tekan Beton Menggunakan Abu Sekam' then 'demo/analisis-kuat-tekan-beton.pdf'
  when 'Senja di Pelabuhan Krueng Geukueh' then 'demo/senja-di-pelabuhan-krueng-geukueh.pdf'
end,
file_name = case title
  when 'Implementasi Sistem Monitoring Jaringan Berbasis IoT' then 'implementasi-monitoring-jaringan-iot.pdf'
  when 'Analisis Kuat Tekan Beton Menggunakan Abu Sekam' then 'analisis-kuat-tekan-beton.pdf'
  when 'Senja di Pelabuhan Krueng Geukueh' then 'senja-di-pelabuhan-krueng-geukueh.pdf'
end
where title in (
  'Implementasi Sistem Monitoring Jaringan Berbasis IoT',
  'Analisis Kuat Tekan Beton Menggunakan Abu Sekam',
  'Senja di Pelabuhan Krueng Geukueh'
);

-- Demo data is inserted only when the corresponding dashboard-created users exist.
do $$
declare
  student_id uuid;
  librarian_id uuid;
  demo_book_id uuid;
  demo_loan_id uuid;
begin
  select id into student_id from auth.users where email = '2022573010041@siperpus.pnl.ac.id';
  select id into librarian_id from auth.users where email = '198503152010011001@siperpus.pnl.ac.id';
  select id into demo_book_id from public.books where code = 'INF-042';
  if student_id is not null then
    update public.profiles set nim = '2022573010041', full_name = 'Mahasiswa Demo', role = 'student'
      where id = student_id;
    if not exists (select 1 from public.holds where user_id = student_id and book_id = demo_book_id and status = 'active') then
      insert into public.holds (user_id, book_id, pin, status, expires_at)
      values (student_id, demo_book_id, 'PNL-HOLD-DEMO', 'active', now() + interval '3 days');
    end if;
    if not exists (select 1 from public.loans where user_id = student_id and book_id = demo_book_id and returned_at is null) then
      insert into public.loans (user_id, book_id, borrowed_at, due_date, status)
      values (student_id, demo_book_id, now() - interval '10 days', now() + interval '4 days', 'borrowed')
      returning id into demo_loan_id;
    end if;
    if demo_loan_id is not null and not exists (select 1 from public.fines where loan_id = demo_loan_id) then
      insert into public.fines (user_id, loan_id, amount, days_late, status)
      values (student_id, demo_loan_id, 1000, 1, 'unpaid');
    end if;
  end if;
  if librarian_id is not null then
    update public.profiles set nim = '198503152010011001', full_name = 'Pustakawan Demo', role = 'librarian'
      where id = librarian_id;
  end if;
end $$;
