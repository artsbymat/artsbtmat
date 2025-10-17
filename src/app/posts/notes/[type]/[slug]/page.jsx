import HeadingPage from "@/components/public/HeadingPage";
import { RenderMarkdown } from "@/components/public/Posts/RenderMarkdown";
import { getAllSlugs, getPostBySlug } from "@/lib/public-content";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  const { notes } = getAllSlugs();
  return notes;
}

export default async function DetailBlogPage({ params }) {
  const { type, slug } = await params;

  let detail;

  detail = getPostBySlug(`/posts/notes/${type}/${slug}`);

  if (!detail) {
    return notFound();
  }

  const title = detail.title;
  const description = detail.frontmatter.description;

  return (
    <article>
      <HeadingPage title={title} description={description} />
      <div id="markdown-content">
        <RenderMarkdown detail={detail} />
      </div>
    </article>
  );
}
