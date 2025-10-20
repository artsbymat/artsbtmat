import { formattedDateMonthYear } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export function BlogPostCard({ post }) {
  const date = formattedDateMonthYear(new Date(post.frontmatter.created)).split(" ");
  const { tags = [] } = post.frontmatter;

  return (
    <article className="py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        {/* Date */}
        <div className="flex min-w-[80px] flex-row items-center gap-2 text-xl md:flex-col md:items-start md:justify-between md:gap-y-2">
          <span className="font-normal">{date[0]}</span>
          <hr className="border-border w-5 border-b-1" />
          <span className="text-2xl font-normal">{date[1]}</span>
        </div>

        {/* Thumbnail */}
        <div className="relative aspect-[16/9] w-full md:w-[400px]">
          <Link href={post.slug}>
            <Image
              src={post.frontmatter.thumbnail}
              alt={`thumbnail ${post.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain object-center"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center md:flex-1">
          <Link href={post.slug}>
            <h3 className="text-xl leading-snug font-medium">{post.title}</h3>
          </Link>

          {tags.length > 0 && (
            <p className="text-foreground text-sm font-light">
              tags:{" "}
              {tags.map((tag, index) => (
                <span key={tag}>
                  <Link href={`/tags/${tag}`}>{tag}</Link>
                  {index < tags.length - 1 && ", "}
                </span>
              ))}
            </p>
          )}

          {post.frontmatter.description && (
            <p className="text-foreground/80 mt-3 text-base">{post.frontmatter.description}</p>
          )}
        </div>
      </div>
    </article>
  );
}
