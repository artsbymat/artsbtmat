import HeadingPage from "@/components/public/HeadingPage";
import { NotesPosts } from "@/components/public/NotesPosts";
import { getAllUniqueTags, getPostsByTag } from "@/lib/public-content";

export async function generateStaticParams() {
  const tags = getAllUniqueTags();

  // Must return array of objects matching dynamic param names
  return tags.map((tag) => ({
    tag // corresponds to [tag]
  }));
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);

  const title = `"${tag}" – Connected Notes`;
  const description = `Entries linked by the tag "${tag}", showing how thoughts and writings intersect around this idea.`;

  return (
    <div>
      <HeadingPage title={title} description={description} />
      <NotesPosts posts={posts} heading="Posts" />
    </div>
  );
}
