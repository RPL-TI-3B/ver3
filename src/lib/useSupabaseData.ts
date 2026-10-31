import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Book, RepoItem } from "../types";
import { books as fallbackBooks, repoItems as fallbackRepoItems } from "../data/mockData";

export function useBooks() {
  const [items, setItems] = useState<Book[]>(fallbackBooks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("books")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;

      if (data && data.length > 0) {
        // Map table schema to UI Book type
        const mappedBooks: Book[] = data.map((b) => ({
          code: b.code,
          title: b.title,
          author: b.author,
          shelf: b.shelf || "Umum",
          stock: b.stock ?? 0,
          department: b.category || "Teknik Informatika (TIK)",
          theme: "Algoritma & RPL",
          cover: b.cover_url || "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=400&q=80",
        }));
        setItems(mappedBooks);
      }
    } catch (err: any) {
      console.warn("Menggunakan fallback mock buku:", err?.message || err);
      setError(err?.message || "Gagal mengambil data buku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return { books: items, loading, error, refetch: fetchBooks, setBooks: setItems };
}

export function useRepository() {
  const [items, setItems] = useState<RepoItem[]>(fallbackRepoItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRepoItems = async () => {
    try {
      setLoading(true);
      const { data, error: err } = await supabase
        .from("repository_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (err) throw err;

      if (data && data.length > 0) {
        const mapped: RepoItem[] = data.map((item) => ({
          title: item.title,
          author: item.author || "Mahasiswa PNL",
          department: item.prodi || "Teknik Informatika",
          size: item.file_size || "2.4 MB",
          category: "nonfiction",
          type: "Skripsi / Tugas Akhir",
          accent: "text-pnl-blue",
          year: String(item.year || 2024),
          badge: item.status === "published" ? "Terverifikasi" : "Kurasi",
        }));
        setItems(mapped);
      }
    } catch (err: any) {
      console.warn("Menggunakan fallback mock repo:", err?.message || err);
      setError(err?.message || "Gagal mengambil data repository");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepoItems();
  }, []);

  return { repoItems: items, loading, error, refetch: fetchRepoItems };
}
