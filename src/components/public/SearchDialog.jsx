"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper, Search } from "lucide-react";
import Link from "next/link";
import { escapeHtml } from "@/lib/utils";

export function SearchDialog() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [indexReady, setIndexReady] = useState(false);
  const indexRef = useRef(null);
  const loadOnceRef = useRef(false);
  const loadAbortRef = useRef(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = async (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) return;
    if (loadOnceRef.current || indexRef.current) return;

    loadOnceRef.current = true;
    const controller = new AbortController();
    loadAbortRef.current = controller;
    try {
      const [exported, flex] = await Promise.all([
        fetch("/content/search-index.json", { signal: controller.signal }).then((r) => r.json()),
        import("flexsearch")
      ]);

      const doc = new flex.Document({
        document: {
          id: "slug",
          index: ["title", "content", "tags"],
          store: ["title", "slug", "content", "tags"]
        },
        tokenize: "forward",
        cache: true
      });

      for (const [key, data] of Object.entries(exported)) {
        doc.import(key, data);
      }
      indexRef.current = doc;
      setIndexReady(true);
    } catch (e) {
      // noop; keep dialog usable even if index fails
      console.error("Failed to load search index:", e);
      setIndexReady(false);
      loadOnceRef.current = false; // allow retry on next open
    } finally {
      loadAbortRef.current = null;
    }
  };

  // Debounced search to reduce work per keystroke
  useEffect(() => {
    if (!indexRef.current || !query.trim()) {
      setResults([]);
      return;
    }
    const id = setTimeout(() => {
      const idx = indexRef.current;
      if (!idx) return;
      startTransition(() => {
        const highlight = {
          template: "<mark>$1</mark>",
          boundary: 160,
          clip: true,
          merge: true
        };

        const merged = idx.search(query, {
          index: ["title", "content", "tags"],
          enrich: true,
          highlight,
          merge: true,
          limit: 10
        });

        const docs = merged.map((entry) => ({
          ...entry.doc,
          highlights: entry.highlight || {}
        }));

        setResults(docs);
      });
    }, 300);
    return () => clearTimeout(id);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="icon-sm" aria-label="Open search dialog">
          <Search />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-hidden rounded-none">
        <DialogHeader>
          <DialogTitle>Search Posts</DialogTitle>
          <DialogDescription>Search through your published posts.</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Newspaper className="text-foreground/50 absolute top-2 left-2 size-5" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border-1 border-black py-2 pl-8 text-sm outline-none"
          />
        </div>

        <ScrollArea className="border-border h-[clamp(200px,50vh,400px)] border p-4">
          {!indexReady && open ? (
            <p className="text-sm">Loading index…</p>
          ) : isPending ? (
            <p className="text-sm">Searching...</p>
          ) : results.length === 0 && query ? (
            <p className="text-sm">No results found.</p>
          ) : (
            <div className="divide-border-border space-y-4 divide-y">
              {results.map((post) => (
                <div key={post.slug}>
                  <Link href={post.slug} className="font-medium hover:underline">
                    <DialogClose asChild>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: post.highlights?.title || escapeHtml(post.title)
                        }}
                      />
                    </DialogClose>
                  </Link>

                  <p
                    className="line-clamp-3 w-full max-w-full overflow-hidden text-sm break-words [word-break:break-word] text-ellipsis"
                    dangerouslySetInnerHTML={{
                      __html:
                        post.highlights?.content || escapeHtml(post.content?.slice(0, 160) || "")
                    }}
                  />

                  {post.tags ? (
                    <p className="text-foreground/70 text-xs">
                      Tags:{" "}
                      <span
                        dangerouslySetInnerHTML={{
                          __html: post.highlights?.tags || escapeHtml(post.tags)
                        }}
                      />
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
