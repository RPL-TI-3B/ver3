import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const enabled = process.env.DEMO_SEED_ENABLED === "true";
if (!enabled) throw new Error("Set DEMO_SEED_ENABLED=true to run the demo seeder.");
if (process.env.NODE_ENV === "production") throw new Error("The demo seeder is disabled in production.");

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
}

const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
const emailFor = (nim) => `${nim}@siperpus.pnl.ac.id`;
const root = resolve(process.cwd());
const demoPdf = (name) => resolve(root, "public", "demo-pdfs", name);
const now = Date.now();
const iso = (offsetDays) => new Date(now + offsetDays * 86400000).toISOString();
const id = {
  books: {
    unpaid: "d0000000-0000-4000-8000-000000000001",
    active: "d0000000-0000-4000-8000-000000000002",
    overdue: "d0000000-0000-4000-8000-000000000003",
    hold: "d0000000-0000-4000-8000-000000000004",
    pending: "d0000000-0000-4000-8000-000000000005",
    rejected: "d0000000-0000-4000-8000-000000000006",
    paidOne: "d0000000-0000-4000-8000-000000000007",
    paidTwo: "d0000000-0000-4000-8000-000000000008",
  },
  loans: {
    unpaid: "d1000000-0000-4000-8000-000000000001",
    active: "d1000000-0000-4000-8000-000000000002",
    overdue: "d1000000-0000-4000-8000-000000000003",
    pending: "d1000000-0000-4000-8000-000000000004",
    rejected: "d1000000-0000-4000-8000-000000000005",
    paidOne: "d1000000-0000-4000-8000-000000000006",
    paidTwo: "d1000000-0000-4000-8000-000000000007",
  },
  holds: { active: "d2000000-0000-4000-8000-000000000001" },
  fines: {
    unpaid: "d3000000-0000-4000-8000-000000000001",
    pending: "d3000000-0000-4000-8000-000000000002",
    rejected: "d3000000-0000-4000-8000-000000000003",
    paid: "d3000000-0000-4000-8000-000000000004",
  },
  repo: {
    pending: "d4000000-0000-4000-8000-000000000001",
    published: "d4000000-0000-4000-8000-000000000002",
    revision: "d4000000-0000-4000-8000-000000000003",
  },
};

const students = [
  ["2022573010041", "Mahasiswa Demo", "Teknologi Informasi dan Komputer"],
  ["2022573010042", "Siti Rahma", "Bisnis"],
  ["2022573010043", "Rafi Akbar", "Teknik Elektro"],
  ["2022573010044", "Nur Aini", "Teknik Mesin"],
  ["2022573010045", "Fajar Pratama", "Teknik Kimia"],
  ["2022573010046", "Nadia Putri", "Teknik Sipil"],
  ["2022573010047", "Dimas Saputra", "Teknologi Informasi dan Komputer"],
  ["2022573010048", "Cut Nabila", "Bisnis"],
  ["2022573010049", "Muhammad Fajri", "Teknologi Informasi dan Komputer"],
].map(([nim, fullName, prodi]) => ({ nim, fullName, prodi, email: emailFor(nim) }));

const fail = (label, result) => {
  if (result.error) throw new Error(`${label}: ${result.error.message}`);
  return result.data;
};

const users = {};
const listedResult = await supabase.auth.admin.listUsers({ perPage: 1000 });
if (listedResult.error) throw new Error(`List Auth users: ${listedResult.error.message}`);
const listed = listedResult.data;
for (const student of students) {
  let authUser = listed?.users.find((user) => user.email === student.email);
  if (!authUser) {
    const result = await supabase.auth.admin.createUser({
      email: student.email,
      password: student.nim,
      email_confirm: true,
      user_metadata: { nim: student.nim, full_name: student.fullName, prodi: student.prodi },
      app_metadata: { role: "student" },
    });
    const created = fail(`Create ${student.nim}`, result);
    authUser = created.user;
    if (!authUser) throw new Error(`Create ${student.nim}: Auth user was not returned.`);
  }
  const appMetadata = { ...(authUser.app_metadata ?? {}), role: "student" };
  fail(`Student ${student.nim}`, await supabase.auth.admin.updateUserById(authUser.id, {
    password: student.nim,
    app_metadata: appMetadata,
  }));
  users[student.nim] = authUser.id;
  fail(`Profile ${student.nim}`, await supabase.from("profiles").upsert({
    id: authUser.id,
    nim: student.nim,
    full_name: student.fullName,
    role: "student",
    prodi: student.prodi,
    clear_status: true,
  }, { onConflict: "id" }));
}

const { data: librarian } = await supabase
  .from("profiles")
  .select("id")
  .eq("role", "librarian")
  .limit(1)
  .maybeSingle();
if (!librarian) throw new Error("A librarian profile is required for paid-fine verification fixtures.");

const books = [
  [id.books.unpaid, "DEMO-STUDENT-UNPAID", "Demo: Jaringan Komputer Dasar", "Akun Demo", 1],
  [id.books.active, "DEMO-STUDENT-AKTIF", "Demo: Dasar Sistem Kendali", "Akun Demo", 1],
  [id.books.overdue, "DEMO-STUDENT-TERLAMBAT", "Demo: Termodinamika Teknik", "Akun Demo", 1],
  [id.books.hold, "DEMO-STUDENT-HOLD", "Demo: Operasi Teknik Kimia", "Akun Demo", 1],
  [id.books.pending, "DEMO-STUDENT-PENDING", "Demo: Struktur Beton", "Akun Demo", 1],
  [id.books.rejected, "DEMO-STUDENT-REJECTED", "Demo: Keamanan Siber", "Akun Demo", 1],
  [id.books.paidOne, "DEMO-STUDENT-PAID-1", "Demo: Manajemen Bisnis", "Akun Demo", 1],
  [id.books.paidTwo, "DEMO-STUDENT-PAID-2", "Demo: Bahasa Indonesia", "Akun Demo", 1],
].map(([bookId, code, title, author, baseStock]) => ({
  id: bookId, code, title, author, category: "Demo", year: 2026, stock: baseStock, shelf: "DEMO", cover_url: null,
}));
fail("Demo books", await supabase.from("books").upsert(books, { onConflict: "id" }));

const demoBookIds = books.map((book) => book.id);
const existingDemoLoans = await supabase.from("loans").select("id").in("book_id", demoBookIds);
if (existingDemoLoans.error) throw new Error(`Find demo loans: ${existingDemoLoans.error.message}`);
const existingDemoLoanIds = existingDemoLoans.data?.map((loan) => loan.id) ?? [];
if (existingDemoLoanIds.length) {
  fail("Reset demo fines", await supabase.from("fines").delete().in("loan_id", existingDemoLoanIds));
  fail("Reset demo loans", await supabase.from("loans").delete().in("id", existingDemoLoanIds));
}
fail("Reset demo holds", await supabase.from("holds").delete().in("book_id", demoBookIds));

const legacy = await supabase.from("books").select("id").eq("code", "INF-042").maybeSingle();
if (legacy.data?.id) {
  const oldLoans = await supabase.from("loans").select("id").eq("user_id", users["2022573010041"]).eq("book_id", legacy.data.id);
  if (oldLoans.data?.length) {
    const oldLoanIds = oldLoans.data.map((loan) => loan.id);
    fail("Remove legacy fines", await supabase.from("fines").delete().in("loan_id", oldLoanIds));
    fail("Remove legacy loans", await supabase.from("loans").delete().in("id", oldLoanIds));
  }
  fail("Remove legacy hold", await supabase.from("holds").delete().eq("user_id", users["2022573010041"]).eq("book_id", legacy.data.id).eq("pin", "PNL-HOLD-DEMO"));
}

const loans = [
  { id: id.loans.unpaid, user_id: users["2022573010041"], book_id: id.books.unpaid, borrowed_at: iso(-20), due_date: iso(-10), returned_at: iso(-7), status: "returned" },
  { id: id.loans.active, user_id: users["2022573010043"], book_id: id.books.active, borrowed_at: iso(-9), due_date: iso(5), returned_at: null, status: "borrowed" },
  { id: id.loans.overdue, user_id: users["2022573010044"], book_id: id.books.overdue, borrowed_at: iso(-18), due_date: iso(-4), returned_at: null, status: "overdue" },
  { id: id.loans.pending, user_id: users["2022573010046"], book_id: id.books.pending, borrowed_at: iso(-15), due_date: iso(-8), returned_at: iso(-6), status: "returned" },
  { id: id.loans.rejected, user_id: users["2022573010047"], book_id: id.books.rejected, borrowed_at: iso(-14), due_date: iso(-7), returned_at: iso(-6), status: "returned" },
  { id: id.loans.paidOne, user_id: users["2022573010048"], book_id: id.books.paidOne, borrowed_at: iso(-30), due_date: iso(-16), returned_at: iso(-16), status: "returned" },
  { id: id.loans.paidTwo, user_id: users["2022573010048"], book_id: id.books.paidTwo, borrowed_at: iso(-25), due_date: iso(-11), returned_at: iso(-8), status: "returned" },
];
fail("Demo loans", await supabase.from("loans").upsert(loans, { onConflict: "id" }));

fail("Demo hold", await supabase.from("holds").upsert({
  id: id.holds.active,
  user_id: users["2022573010045"],
  book_id: id.books.hold,
  pin: "PNL-HOLD-DEMO45",
  status: "active",
  expires_at: iso(2),
}, { onConflict: "id" }));

const receiptPath = `${users["2022573010046"]}/demo/qris-nadia-putri.pdf`;
const rejectedReceiptPath = `${users["2022573010047"]}/demo/qris-dimas-saputra.pdf`;
for (const [path, file] of [[receiptPath, "demo-qris-receipt.pdf"], [rejectedReceiptPath, "demo-qris-receipt.pdf"]]) {
  const localPath = demoPdf(file);
  if (!existsSync(localPath)) throw new Error(`Missing demo receipt: ${localPath}`);
  fail(`Upload ${path}`, await supabase.storage.from("qris-receipts").upload(path, readFileSync(localPath), { upsert: true, contentType: "application/pdf" }));
}

fail("Demo fines", await supabase.from("fines").upsert([
  { id: id.fines.unpaid, user_id: users["2022573010041"], loan_id: id.loans.unpaid, amount: 3000, days_late: 3, status: "unpaid", receipt_url: null, rejection_note: null, verified_at: null, verified_by: null },
  { id: id.fines.pending, user_id: users["2022573010046"], loan_id: id.loans.pending, amount: 2000, days_late: 2, status: "pending_verification", receipt_url: receiptPath, rejection_note: null, verified_at: null, verified_by: null },
  { id: id.fines.rejected, user_id: users["2022573010047"], loan_id: id.loans.rejected, amount: 1000, days_late: 1, status: "unpaid", receipt_url: rejectedReceiptPath, rejection_note: "Bukti pembayaran tidak dapat diverifikasi. Silakan unggah bukti pembayaran yang lebih jelas.", verified_at: null, verified_by: null },
  { id: id.fines.paid, user_id: users["2022573010048"], loan_id: id.loans.paidTwo, amount: 3000, days_late: 3, status: "paid", receipt_url: null, rejection_note: null, verified_at: iso(-5), verified_by: librarian.id },
], { onConflict: "id" }));

fail("Student clear status", await supabase.from("profiles").update({
  clear_status: false,
}).in("nim", ["2022573010041", "2022573010046", "2022573010047"]));
fail("Paid student clear status", await supabase.from("profiles").update({
  clear_status: true,
}).eq("nim", "2022573010048"));

const fixtureRepo = [
  [id.repo.pending, users["2022573010049"], "Demo Fajri - Menunggu Kurasi", "demo/implementasi-monitoring-jaringan-iot.pdf", "pending_curation", null],
  [id.repo.published, users["2022573010049"], "Demo Fajri - Karya Terbit", "demo/analisis-kuat-tekan-beton.pdf", "published", null],
  [id.repo.revision, users["2022573010049"], "Demo Fajri - Perlu Revisi", "demo/senja-di-pelabuhan-krueng-geukueh.pdf", "revision_needed", "Abstrak perlu dilengkapi dan format halaman diperbaiki."],
].map(([repoId, authorId, title, pdfUrl, status, reviewerNotes]) => ({
  id: repoId, author_id: authorId, author_name: "Muhammad Fajri", title, prodi: "Teknologi Informasi dan Komputer",
  year: 2026, abstract: "DATA DEMO / KARYA SINTETIS untuk pengujian SIPERPUS-REPO.",
  category: title.includes("Karya Terbit") ? "nonfiction" : "fiction", type: "Laporan Magang",
  status, reviewer_notes: reviewerNotes, pdf_url: pdfUrl, file_name: pdfUrl.split("/").at(-1), file_size: "2.30 MB",
}));
fail("Fajri repository fixtures", await supabase.from("repository_items").upsert(fixtureRepo, { onConflict: "id" }));

const legacyRepoOwners = [
  ["Implementasi Sistem Monitoring Jaringan Berbasis IoT", users["2022573010049"], "Muhammad Fajri", "Teknologi Informasi dan Komputer"],
  ["Analisis Kuat Tekan Beton Menggunakan Abu Sekam", users["2022573010044"], "Nur Aini", "Teknik Mesin"],
  ["Senja di Pelabuhan Krueng Geukueh", users["2022573010048"], "Cut Nabila", "Bisnis"],
];
for (const [title, authorId, authorName, prodi] of legacyRepoOwners) {
  fail(`Repository owner ${title}`, await supabase.from("repository_items").update({ author_id: authorId, author_name: authorName, prodi }).eq("title", title));
}

const stock = [
  [id.books.unpaid, 1], [id.books.active, 0], [id.books.overdue, 0], [id.books.hold, 0],
  [id.books.pending, 1], [id.books.rejected, 1], [id.books.paidOne, 1], [id.books.paidTwo, 1],
];
for (const [bookId, value] of stock) fail(`Stock ${bookId}`, await supabase.from("books").update({ stock: value }).eq("id", bookId));

console.log(`Prepared ${students.length} student demo accounts and deterministic scenarios.`);
