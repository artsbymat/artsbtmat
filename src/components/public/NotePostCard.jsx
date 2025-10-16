import { formattedDateMonthYear } from "@/lib/utils";
import Link from "next/link";

export function NotePostCard({ post }) {
  const { slug, title, frontmatter } = post;
  const { tags = [] } = frontmatter;

  return (
    <article className="py-2">
      <div className="flex justify-between">
        <div>
          <Link href={slug}>
            <h3 className="text-base leading-snug font-medium">{title}</h3>
          </Link>

          {tags.length > 0 && (
            <p className="text-foreground/80 text-sm">
              tags:{" "}
              {tags.map((tag, index) => (
                <span key={tag}>
                  <Link href={`/tags/${tag}`}>{tag}</Link>
                  {index < tags.length - 1 && ", "}
                </span>
              ))}
            </p>
          )}
        </div>
        <p className="text-foreground/80 text-sm">
          {formattedDateMonthYear(new Date(post.frontmatter.created || new Date()))}
        </p>
      </div>
    </article>
  );
}
