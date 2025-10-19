import HeadingPage from "@/components/public/HeadingPage";
import { RenderMarkdown } from "@/components/public/Posts/RenderMarkdown";
import { getAllSlugs, getPostBySlug } from "@/lib/public-content";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { type, slug } = await params;
  const detail = getPostBySlug(`/posts/notes/${type}/${slug}`);
  if (!detail) return {};

  const description =
    detail.frontmatter.description ||
    detail.content
      .replace(/[#_*`>\[\]]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);

  return {
    title: {
      absolute: detail.title
    },
    description: description,
    keywords: detail.frontmatter.tags
  };
}

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
      <HeadingPage title={title} description={description} variant="posts" />
      <RenderMarkdown detail={detail} />
    </article>
  );
}
