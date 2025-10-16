import { BlogPosts } from "@/components/public/BlogPosts";
import HeadingPage from "@/components/public/HeadingPage";
import { MindmapPosts } from "@/components/public/MindmapPosts";
import { NotesPosts } from "@/components/public/NotesPosts";
import { getAllBlogPosts, getAllNotesPosts } from "@/lib/public-content";
import { getAllExcalidrawPosts } from "@/lib/public-excalidraw";

export default function PostsPage() {
  const blogPosts = getAllBlogPosts();
  const notesPosts = getAllNotesPosts();
  const excalidrawPosts = getAllExcalidrawPosts();
  const title = "Garden of Thoughts - Blog, Notes & Mindmaps";
  const description =
    "A space where ideas grow and connect. Browse through essays, quick notes, and visual mindmaps tracing the evolution of thinking and creativity.";

  return (
    <div>
      <HeadingPage title={title} description={description} />
      <BlogPosts posts={blogPosts} />
      <NotesPosts posts={notesPosts} />
      <MindmapPosts posts={excalidrawPosts} />
    </div>
  );
}
