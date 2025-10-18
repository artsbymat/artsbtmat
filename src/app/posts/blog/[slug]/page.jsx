import HeadingPage from "@/components/public/HeadingPage";
import { RenderMarkdown } from "@/components/public/Posts/RenderMarkdown";
import { getAllSlugs, getPostBySlug } from "@/lib/public-content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const { blog } = getAllSlugs();
  return blog;
}

export default async function DetailBlogPage({ params }) {
  const { slug } = await params;

  const detail = getPostBySlug(`/posts/blog/${slug}`);

  if (!detail) {
    return notFound();
  }

  const title = detail.title;
  const description = detail.frontmatter.description;

  return (
    <article>
      <HeadingPage title={title} description={description} variant="posts" />
      <div id="markdown-content">
        <RenderMarkdown detail={detail} />
      </div>
    </article>
  );
}
