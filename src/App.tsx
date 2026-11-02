import { useState } from "react";
import StudentPortal from "./StudentPortal";
import LibrarianPortal from "./LibrarianPortal";
import { Brand } from "./components/ui/Brand";
import { Button } from "./components/ui/Button";
import { Icon } from "./components/ui/Icon";
import { LoginModal } from "./components/ui/LoginModal";
import { ContactModal } from "./components/ui/ContactModal";
import { BooksView } from "./pages/CatalogPage";
import { RepositoryView } from "./pages/RepositoryPage";
import { AboutView } from "./pages/AboutPage";
import { Tab, ModalSource, RepoItem, Book } from "./types";
import { useAuth } from "./lib/authContext";
import { supabase } from "./lib/supabase";

export default function App() {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("books");
  const [modalSource, setModalSource] = useState<ModalSource | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: "books", label: "Buku Fisik" },
    { id: "erepo", label: "E-Repository" },
    { id: "about", label: "Tentang" },
  ];

  const openAction = (source: ModalSource) => {
    if (!user) setModalSource(source);
  };
  const reserve = async (book: Book) => {
    if (!user) return openAction("reservation");
    const { error } = await supabase.rpc("reserve_book", { book_id: book.id });
    if (error) console.error(error);
  };
  const download = async (item: RepoItem) => {
    if (!user) return openAction("download");
    if (!item.pdfUrl) return;
    const { data, error } = await supabase.storage.from("repository-files").createSignedUrl(item.pdfUrl, 300);
    if (error || !data?.signedUrl) return;
    const downloadUrl = new URL(data.signedUrl);
    downloadUrl.searchParams.set("download", `${item.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase()}.pdf`);
    const { error: recordError } = await supabase.rpc("record_download", { item_id: item.id });
    if (recordError) return;
    window.open(downloadUrl.toString(), "_blank", "noopener,noreferrer");
  };
  if (loading) return <div className="grid min-h-screen place-items-center bg-canvas text-muted">Memuat sesi...</div>;
  if (profile?.role === "librarian") return <LibrarianPortal profile={profile} onLogout={signOut} />;
  if (profile?.role === "student") return <StudentPortal profile={profile} onLogout={signOut} />;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <header className="sticky top-0 z-40 border-b border-emerald-950/10/80 bg-white/95 backdrop-blur-lg">
        <div className="mx-auto flex h-20 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Brand />
          <nav className="hidden items-center gap-1 rounded-xl bg-canvas p-1 md:flex" aria-label="Navigasi utama">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative rounded-lg px-5 py-2.5 text-sm font-bold transition ${
                  activeTab === tab.id ? "bg-white text-ink shadow-sm" : "text-muted hover:text-ink"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && <span className="absolute inset-x-5 -bottom-1 h-0.5 rounded-full bg-accent" />}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {user ? <Button variant="secondary" onClick={signOut} className="hidden sm:flex">Keluar</Button> : (
              <Button onClick={() => setModalSource("navbar")} className="hidden sm:flex">
                <Icon name="lock" size="size-4" /> Masuk SSO PNL
              </Button>
            )}
            <button
              type="button"
              onClick={() => setMobileMenu(!mobileMenu)}
              aria-label="Buka navigasi"
              className="flex size-10 items-center justify-center rounded-xl border border-emerald-950/10 text-muted md:hidden"
            >
              <Icon name={mobileMenu ? "close" : "list"} />
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="border-t border-slate-100 bg-white p-4 md:hidden">
            <div className="grid gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenu(false);
                  }}
                  className={`rounded-xl px-4 py-3 text-left text-sm font-bold ${
                    activeTab === tab.id ? "bg-accent-soft text-ink" : "text-muted"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              {!user && (
                <Button
                  onClick={() => {
                    setModalSource("navbar");
                    setMobileMenu(false);
                  }}
                  className="mt-2"
                >
                  <Icon name="lock" size="size-4" /> Masuk SSO PNL
                </Button>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {activeTab === "books" && <BooksView onReserve={reserve} />}
        {activeTab === "erepo" && <RepositoryView onDownload={download} />}
        {activeTab === "about" && <AboutView onOpenContact={() => setShowContactModal(true)} />}
      </main>

      <footer className="mt-16 border-t border-emerald-950/10 bg-white">
        <div className="mx-auto flex max-w-screen-2xl flex-col gap-4 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <Brand />
          <p className="text-xs font-medium text-slate-400">© {new Date().getFullYear()} Politeknik Negeri Lhokseumawe · UPT Perpustakaan</p>
        </div>
      </footer>

      {modalSource && <LoginModal source={modalSource} onClose={() => setModalSource(null)} />}

      {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
    </div>
  );
}
