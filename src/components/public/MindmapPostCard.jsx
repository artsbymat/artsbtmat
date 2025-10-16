import { formatMindmapTitle } from "@/lib/public-excalidraw";
import Image from "next/image";
import Link from "next/link";

export function MindmapPostCard({ post }) {
  return (
    <article className="border-border my-4 border-1 p-4">
      <div className="relative aspect-[4/3] max-h-[300px] w-full">
        <Image src={post.path} alt={`mindmap ${post.title}`} fill className="object-contain" />
      </div>
      <Link href={post.slug}>
        <h3 className="mt-3 text-base leading-snug font-medium">
          {formatMindmapTitle(post.title)}
        </h3>
      </Link>
    </article>
  );
}
