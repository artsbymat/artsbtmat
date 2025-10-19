import HeadingPage from "@/components/public/HeadingPage";
import { NotesPosts } from "@/components/public/NotesPosts";
import { getAllUniqueTags, getPostsByTag } from "@/lib/public-content";

export async function generateMetadata({ params }) {
  const { tag } = await params;

  if (!tag) return {};

  const cleanTag = decodeURIComponent(tag);
  const capitalizedTag = cleanTag.charAt(0).toUpperCase() + cleanTag.slice(1);

  const title = `Tag: ${capitalizedTag} Kumpulan Tulisan dan Catatan`;
  const description = `Semua tulisan dan catatan yang menggunakan tag "${capitalizedTag}". Telusuri ide, topik, dan gagasan yang saling berhubungan melalui tag ini.`;

  return {
    title,
    description,
    keywords: ["tag", "blog", "catatan"]
  };
}

export async function generateStaticParams() {
  const tags = getAllUniqueTags();

  return tags.map((tag) => ({
    tag
  }));
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  const title = `"${tag}" - Connected Notes`;
  const description = `Entries linked by the tag "${tag}", showing how thoughts and writings intersect around this idea.`;

  return (
    <div>
      <HeadingPage title={title} description={description} />
      <NotesPosts posts={posts} heading="Posts" />
    </div>
  );
}
