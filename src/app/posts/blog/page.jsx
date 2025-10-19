import { BlogPosts } from "@/components/public/BlogPosts";
import HeadingPage from "@/components/public/HeadingPage";
import { getAllBlogPosts } from "@/lib/public-content";

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
