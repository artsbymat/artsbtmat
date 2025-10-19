import { BlogPosts } from "@/components/public/BlogPosts";
import HeadingPage from "@/components/public/HeadingPage";
import { getAllBlogPosts } from "@/lib/public-content";

export const metadata = {
  title: "Blog Rahmat Ardiansyah",
  description:
    "Kumpulan tulisan dan refleksi oleh Rahmat Ardiansyah. Menjelajahi kreativitas, proses belajar, dan gagasan seputar pengembangan web serta teknologi digital modern.",
  keywords: [
    "Rahmat Ardiansyah",
    "Blog",
    "Tulisan",
    "Refleksi",
    "Pemikiran",
    "Kreativitas",
    "Belajar",
    "Pengembangan Web",
    "Teknologi Digital"
  ]
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const title = "Blog - Garden of Thoughts";
  const description =
    "Long-form reflections and essays exploring creativity, learning, and the evolving landscape of ideas.";

  return (
    <div>
      <HeadingPage title={title} description={description} />
      <BlogPosts posts={posts} />
    </div>
  );
}
