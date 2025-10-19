import HeadingPage from "@/components/public/HeadingPage";
import { NotesPosts } from "@/components/public/NotesPosts";
import { getAllNotesPosts } from "@/lib/public-content";

export const metadata = {
  title: "Catatan Rahmat Ardiansyah",
  description:
    "Kumpulan catatan yang saling terhubung menggunakan teknik berpikir produktif - mulai dari eksplorasi teknis hingga membentuk jejaring ide dalam pengembangan web dan teknologi digital.",
  keywords: [
    "Rahmat Ardiansyah",
    "Notes",
    "Catatan",
    "Berpikir Produktif",
    "Zettelkasten",
    "Ide dan Konsep"
  ]
};

export default function NotesPage() {
  const posts = getAllNotesPosts();
  const title = "Notes - Topics, Permanent, and Hub";
  const description =
    "A collection of interconnected notes that evolve through different stages of thinking - from structured technical explorations (topics), to refined, lasting insights (permanent), to linking hubs that connect related ideas.";

  return (
    <div>
      <HeadingPage title={title} description={description} />
      <NotesPosts posts={posts} />
    </div>
  );
}
