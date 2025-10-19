import { BlogPosts } from "@/components/public/BlogPosts";
import HeadingPage from "@/components/public/HeadingPage";
import { NotesPosts } from "@/components/public/NotesPosts";
import { getAllBlogPosts, getAllNotesPosts } from "@/lib/public-content";

export const metadata = {
  title: "Blog dan catatan Rahmat Ardiansyah",
  description:
    "Kumpulan tulisan, catatan, dan mindmap dari Rahmat Ardiansyah. Menelusuri proses berpikir, eksperimen ide, dan pembelajaran seputar pengembangan web serta teknologi digital.",
  keywords: [
    "Rahmat Ardiansyah",
    "Blog",
    "Catatan",
    "Mindmap",
    "Pemikiran",
    "Pengembangan Web",
    "Teknologi Digital",
    "Belajar Web Development",
    "Tulisan Pribadi"
  ]
};

export default function PostsPage() {
  const blogPosts = getAllBlogPosts();
  const notesPosts = getAllNotesPosts();
  const title = "Garden of Thoughts - Blog, Notes & Mindmaps";
  const description =
    "A space where ideas grow and connect. Browse through essays, quick notes, and visual mindmaps tracing the evolution of thinking and creativity.";

  return (
    <div>
      <HeadingPage title={title} description={description} />
      <BlogPosts posts={blogPosts} isShowViewAll />
      <NotesPosts posts={notesPosts} isShowViewAll />
    </div>
  );
}
