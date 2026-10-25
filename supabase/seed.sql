-- Initial Seed Data for Siperpus
insert into public.books (code, title, author, category, year, stock, shelf, cover_url)
values
  ('INF-042', 'Rekayasa Perangkat Lunak Terapan', 'Dr. Ir. Hamdani, M.T.', 'Teknik Informatika', 2023, 4, 'Rak A-03', 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=400&q=80'),
  ('INF-088', 'Desain Antarmuka & Pengalaman Pengguna Berbasis AI', 'Siti Rahmah, S.Kom., M.Sc.', 'Teknik Informatika', 2024, 2, 'Rak A-05', 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'),
  ('ELK-019', 'Sistem Kendali PLC Berbasis IoT Industri 4.0', 'Ir. Teuku Ridwan, M.Eng.', 'Teknik Elektro', 2022, 0, 'Rak B-01', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80'),
  ('MES-005', 'Termodinamika Terapan untuk Industri Migas', 'Prof. Mukhlis, Ph.D.', 'Teknik Mesin', 2021, 5, 'Rak C-02', 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80'),
  ('KIM-031', 'Teknologi Pengolahan Petrokimia Terpadu', 'Dr. Cut Maryam, S.T., M.Sc.', 'Teknik Kimia', 2023, 3, 'Rak D-04', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=400&q=80'),
  ('AKT-012', 'Akuntansi Forensik Sektor Publik & Perpajakan', 'Zulfikar, S.E., M.Si., Ak.', 'Tata Niaga', 2024, 6, 'Rak E-01', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80')
on conflict (code) do nothing;
