import { FormEvent, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useAuth } from "../lib/authContext";
import { supabase } from "../lib/supabase";

type Item = { id: string; title: string; type: string; category: string; status: string; created_at: string };
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const formatSize = (size: number) => {
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(0)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
};

export function ERepo() {
  const { user, profile } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Laporan Magang");
  const [category, setCategory] = useState<"nonfiction" | "fiction">("nonfiction");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.from("repository_items").select("id,title,type,category,status,created_at").eq("author_id", user.id).order("created_at", { ascending: false });
    setItems((data ?? []) as Item[]);
    if (error) setMessage(error.message);
    setLoading(false);
  };
  useEffect(() => { void load(); }, [user]);

  const selectFile = (candidate: File | null) => {
    setFileError(null);
    if (!candidate) return;
    const isPdf = candidate.type === "application/pdf" || candidate.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setFile(null);
      setFileError("File harus berformat PDF.");
      return;
    }
    if (candidate.size > MAX_FILE_SIZE) {
      setFile(null);
      setFileError("Ukuran file maksimal 10 MB.");
      return;
    }
    setFile(candidate);
  };

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0] ?? null);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    selectFile(event.dataTransfer.files[0] ?? null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user || !file || !title.trim()) return setMessage("Judul dan file PDF wajib diisi.");
    setMessage(null);
    setSubmitting(true);
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const uploadResult = await supabase.storage.from("repository-files").upload(path, file, { upsert: false, contentType: "application/pdf" });
    if (uploadResult.error) {
      setSubmitting(false);
      return setMessage(uploadResult.error.message);
    }
    const { error } = await supabase.from("repository_items").insert({
      author_id: user.id, title: title.trim(), author_name: profile?.full_name, prodi: profile?.prodi ?? "PNL",
      year: new Date().getFullYear(), abstract: "", category, type, status: "pending_curation", pdf_url: path, file_name: file.name, file_size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    });
    if (error) {
      await supabase.storage.from("repository-files").remove([path]);
      setSubmitting(false);
      return setMessage(error.message);
    }
    setTitle(""); setFile(null); setFileError(null); setMessage("Karya dikirim untuk kurasi."); setSubmitting(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    await load();
  };

  return <div className="space-y-5"><header><p className="text-xs font-bold uppercase tracking-wider text-forest">E-Repository & Karya</p><h1 className="mt-1 text-2xl font-black">Arsipkan karya ilmiahmu</h1></header><form onSubmit={(event) => void submit(event)} className="grid gap-4 rounded-2xl border border-emerald-950/10 bg-white p-6"><label className="text-sm font-semibold">Judul karya<input required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-emerald-950/15 px-3 outline-none focus:border-accent" /></label><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Jenis<select value={type} onChange={(event) => setType(event.target.value)} className="mt-2 h-11 w-full rounded-lg border border-emerald-950/15 px-3"><option>Laporan Magang</option><option>Skripsi</option><option>Makalah</option><option>Cerpen</option><option>Karya Kreatif</option></select></label><label className="text-sm font-semibold">Kategori<select value={category} onChange={(event) => setCategory(event.target.value as "nonfiction" | "fiction")} className="mt-2 h-11 w-full rounded-lg border border-emerald-950/15 px-3"><option value="nonfiction">Non-fiksi</option><option value="fiction">Fiksi</option></select></label></div><div><p className="text-sm font-semibold">PDF</p><div role="button" tabIndex={0} onClick={() => fileInputRef.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click(); }} onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={() => setDragging(false)} onDrop={onDrop} className={`mt-2 rounded-2xl border-2 border-dashed p-6 text-center transition ${dragging ? "border-accent bg-accent-soft" : "border-forest/20 bg-canvas"} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent`}><input ref={fileInputRef} required={!file} type="file" accept="application/pdf,.pdf" onChange={onFileChange} className="sr-only" aria-label="Pilih file PDF" />{file ? <div className="flex flex-wrap items-center justify-center gap-3 text-left"><span className="grid size-12 place-items-center rounded-xl bg-danger-soft text-danger">PDF</span><div className="min-w-0"><p className="truncate font-bold">{file.name}</p><p className="text-sm text-muted">{formatSize(file.size)}</p></div><button type="button" onClick={(event) => { event.stopPropagation(); setFile(null); setFileError(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="rounded-lg border border-forest/15 px-3 py-2 text-sm font-semibold text-forest hover:bg-white">Hapus</button><button type="button" onClick={(event) => { event.stopPropagation(); fileInputRef.current?.click(); }} className="rounded-lg bg-forest px-3 py-2 text-sm font-semibold text-white">Ganti file</button></div> : <div className="space-y-2"><div className="mx-auto grid size-12 place-items-center rounded-xl bg-forest text-lg font-black text-accent">↑</div><p className="font-bold">Pilih atau unggah file PDF</p><p className="text-sm text-muted">Seret file PDF ke sini atau klik untuk memilih dari perangkat.</p><span className="inline-flex rounded-lg bg-forest px-4 py-2 text-sm font-bold text-white">Pilih File PDF</span><p className="text-xs text-muted">PDF, maksimal 10 MB</p></div>}</div>{fileError && <p role="alert" className="mt-2 text-sm font-semibold text-danger">{fileError}</p>}</div><button disabled={submitting} className="rounded-lg bg-forest px-4 py-3 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60" type="submit">{submitting ? "Mengirim..." : "Kirim untuk kurasi"}</button>{message && <p role="status" className="text-sm text-muted">{message}</p>}</form><section className="space-y-3"><h2 className="font-bold">Karya saya</h2>{loading ? <div className="rounded-2xl border border-emerald-950/10 bg-white p-10 text-center text-sm text-muted">Memuat karya...</div> : items.length ? items.map((item) => <article key={item.id} className="rounded-2xl border border-emerald-950/10 bg-white p-5"><p className="font-semibold">{item.title}</p><p className="mt-1 text-sm text-muted">{item.type} · {item.category} · {item.status}</p></article>) : <div className="rounded-2xl border border-dashed border-forest/20 bg-white p-10 text-center text-sm text-muted">Belum ada karya yang diunggah.</div>}</section></div>;
}
