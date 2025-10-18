"use client";

import { CalendarArrowUp, CalendarArrowDown } from "lucide-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { NotePostCard } from "./NotePostCard";

export function NotesPosts({ posts, heading = "Notes", isShowViewAll = false }) {
  const [sortOrder, setSortOrder] = useState("DESC");

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = new Date(a.frontmatter.created);
      const dateB = new Date(b.frontmatter.created);
      return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
    });
  }, [posts, sortOrder]);

  const toggleSort = () => {
    setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
  };

  return (
    <section className="mx-auto mb-4 max-w-7xl px-4 md:px-8">
      <div className="border-border flex items-center justify-between border-b py-4">
        <h2 className="text-xl font-medium">{heading}</h2>
        <button
          onClick={toggleSort}
          className="flex items-center gap-1 text-sm"
          title={`Sort ${sortOrder === "ASC" ? "newest first" : "oldest first"}`}
        >
          {sortOrder === "ASC" ? (
            <CalendarArrowUp className="size-5" />
          ) : (
            <CalendarArrowDown className="size-5" />
          )}
        </button>
      </div>

      {sortedPosts.length > 0 ? (
        <div className="divide-border-border divide-y">
          {sortedPosts.map((post) => {
            return <NotePostCard key={post.slug} post={post} />;
          })}
        </div>
      ) : (
        <div className="py-4">
          <p className="text-accent text-base font-medium">Ooops... Notes Not Found</p>
        </div>
      )}

      {isShowViewAll && (
        <>
          <hr className="border-border w-5 border-b-1" />
          <Button asChild className="mt-4">
            <Link href="/posts/notes">View All Notes</Link>
          </Button>
        </>
      )}
    </section>
  );
}
