import HeadingPage from "@/components/public/HeadingPage";
import { TagsList } from "@/components/public/TagsList";
import { getAllUniqueTags, getTagCounts } from "@/lib/public-content";

export default function TagsPage() {
  const title = "Tags - Explore Connected Posts";
  const description =
    "Browse all tags to discover how posts relate to each other through shared topics and ideas.";

  const tags = getAllUniqueTags();
  const tagCounts = getTagCounts();

  const tagsWithCount = tags.map((tag) => ({
    tag,
    count: tagCounts[tag] || 0
  }));

  return (
    <div>
      <HeadingPage title={title} description={description} />
      <TagsList tagsWithCount={tagsWithCount} />
    </div>
  );
}
