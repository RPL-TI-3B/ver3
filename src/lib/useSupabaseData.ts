import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Book, BookTopic, RepoItem } from "../types";
import { fallbackDepartments, fallbackTopics } from "./catalogTaxonomy";

export function useBooks() {
  const [items, setItems] = useState<Book[]>([]);
  const [topics, setTopics] = useState<BookTopic[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const [{ data, error: err }, { data: topicRows, error: topicError }, { data: departmentRows, error: departmentError }] = await Promise.all([
        supabase.from("books").select("*").order("created_at", { ascending: false }),
        supabase.from("book_topics").select("id,name,slug,parent_id,sort_order").order("sort_order"),
        supabase.from("departments").select("id,name,sort_order").order("sort_order"),
      ]);

      if (err) throw err;
      const taxonomyAvailable = !topicError && !departmentError;
      if (topicError || departmentError) {
        console.warn("Taxonomy tables are unavailable; using legacy book categories.", { topicError, departmentError });
      }

      const topicById = new Map<string, { name: string; parentId: string | null }>();
      const rawTopics = topicRows ?? [];
      const topicNames = new Map(rawTopics.map((row) => [String(row.id), String(row.name)]));
      for (const row of rawTopics) {
        topicById.set(String(row.id), {
          name: String(row.name),
          parentId: row.parent_id ? String(row.parent_id) : null,
        });
      }
      const departmentById = new Map<string, string>();
      for (const row of departmentRows ?? []) {
        departmentById.set(String(row.id), String(row.name));
      }

      if (data) {
        const mappedBooks: Book[] = data.map((raw) => {
          const b = raw as Record<string, unknown>;
          const legacyCategory = typeof b.category === "string" ? b.category : "Umum";
          const topic = typeof b.topic_id === "string" ? topicById.get(b.topic_id) : undefined;
          const parent = topic?.parentId ? topicById.get(topic.parentId) : undefined;
          return {
            id: String(b.id),
            code: String(b.code),
            title: String(b.title),
            author: String(b.author),
            shelf: typeof b.shelf === "string" ? b.shelf : "Umum",
            stock: typeof b.stock === "number" ? b.stock : 0,
            department: taxonomyAvailable && typeof b.department_id === "string" ? departmentById.get(b.department_id) ?? legacyCategory : legacyCategory,
            theme: taxonomyAvailable ? topic?.name ?? "Umum" : legacyCategory,
            mainTheme: taxonomyAvailable ? parent?.name ?? topic?.name ?? "Umum" : legacyCategory,
            departmentId: typeof b.department_id === "string" ? b.department_id : undefined,
            topicId: typeof b.topic_id === "string" ? b.topic_id : undefined,
            cover: typeof b.cover_url === "string" ? b.cover_url : "",
            year: typeof b.year === "number" ? b.year : new Date().getFullYear(),
          };
        });
        setItems(mappedBooks);
      }
      setDepartments(taxonomyAvailable && departmentRows?.length ? departmentRows.map((row) => row.name as string) : fallbackDepartments);
      setTopics(taxonomyAvailable && rawTopics.length ? rawTopics.map((row) => ({
        id: row.id as string,
        name: row.name as string,
        slug: row.slug as string,
        parentId: (row.parent_id as string | null) ?? null,
        parentName: row.parent_id ? topicNames.get(String(row.parent_id)) ?? null : null,
        sortOrder: row.sort_order as number,
      })) : fallbackTopics);
    } catch (err: unknown) {
      console.error("Error fetching books:", err);
      setError(err instanceof Error ? err.message : "Gagal mengambil data buku");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return { books: items, topics, departments, loading, error, refetch: fetchBooks, setBooks: setItems };
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
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (err) throw err;

      if (data) {
        const mapped: RepoItem[] = data.map((item) => ({
          id: item.id,
          title: item.title,
          author: item.author_name || "Mahasiswa PNL",
          department: item.prodi || "Teknologi Informasi dan Komputer",
          size: item.file_size || "Ukuran tidak tersedia",
          category: item.category || "nonfiction",
          type: item.type || "Karya Ilmiah",
          accent: item.category === "fiction" ? "bg-accent-soft text-forest" : "bg-canvas text-forest",
          year: String(item.year || 2024),
          badge: item.status === "published" ? "Terverifikasi" : "Kurasi",
          pdfUrl: item.pdf_url,
          downloadsCount: item.downloads_count ?? 0,
        }));
        setItems(mapped);
      }
    } catch (err: unknown) {
      console.error("Error fetching repository:", err);
      setError(err instanceof Error ? err.message : "Gagal mengambil data repository");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepoItems();
  }, []);

  return { repoItems: items, loading, error, refetch: fetchRepoItems };
}
