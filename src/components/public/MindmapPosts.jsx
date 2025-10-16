import Link from "next/link";
import { Button } from "../ui/button";
import { MindmapPostCard } from "./MindmapPostCard";

export function MindmapPosts({ posts }) {
  return (
    <section className="mx-auto mb-4 max-w-7xl">
      <div className="px-4">
        <div className="border-border flex items-center border-b py-4">
          <h2 className="text-xl font-medium">Mind Map</h2>
        </div>

        {posts.length > 0 ? (
          <div className="divide-border divide-y">
            {posts.map((post) => {
              return <MindmapPostCard key={post.slug} post={post} />;
            })}
          </div>
        ) : (
          <div className="py-4">
            <p className="text-accent text-base font-medium">Ooops... Mind Map Not Found</p>
          </div>
        )}

        <hr className="border-border w-5 border-b-1" />

        <Button asChild className="mt-4">
          <Link href="/mindmap">View All Mind Map</Link>
        </Button>
      </div>
    </section>
  );
}
