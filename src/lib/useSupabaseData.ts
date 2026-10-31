import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Book, RepoItem } from "../types";

export function useBooks() {
  const [items, setItems] = useState<Book[]>([]);
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

      if (data) {
        const mappedBooks: Book[] = data.map((b) => ({
          code: b.code,
          title: b.title,
          author: b.author,
          shelf: b.shelf || "Umum",
          stock: b.stock ?? 0,
          department: b.category || "Umum",
          theme: b.category || "Umum",
          cover: b.cover_url || "https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=400&q=80",
        }));
        setItems(mappedBooks);
      }
    } catch (err: any) {
      console.error("Error fetching books:", err);
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
  const [items, setItems] = useState<RepoItem[]>([]);
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

      if (data) {
        const mapped: RepoItem[] = data.map((item) => ({
          title: item.title,
          author: item.author || "Mahasiswa PNL",
          department: item.prodi || "Teknik Informatika",
          size: item.file_size || "1.0 MB",
          category: "nonfiction",
          type: "Skripsi / Tugas Akhir",
          accent: "text-pnl-blue",
          year: String(item.year || 2024),
          badge: item.status === "published" ? "Terverifikasi" : "Kurasi",
        }));
        setItems(mapped);
      }
    } catch (err: any) {
      console.error("Error fetching repository:", err);
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
