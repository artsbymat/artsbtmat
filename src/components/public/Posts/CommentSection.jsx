"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GoogleSolid } from "@/components/ui/icons";
import { getUser } from "@/data/profiles";
import { getCommentsBySlug, postComment } from "@/data/comments";
import { signInWithGoogle, signOut } from "@/lib/supabase/actions";
import { formattedDateDayMonthYear, formattedDateTime } from "@/lib/utils";

export function CommentSection({ slug }) {
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);

  // Fetch user & comments
  useEffect(() => {
    async function load() {
      const [user, comments] = await Promise.all([getUser(), getCommentsBySlug(slug)]);
      setUser(user);
      setComments((comments || []).slice());
    }
    load();
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.target);
    formData.append("slug", slug);

    const content = formData.get("comment")?.trim();
    if (!content) return;

    const { full_name, avatar_url } = user.user_metadata;

    // Optimistic comment
    const tempId = Math.random().toString(36).substring(2);
    const optimisticComment = {
      id: tempId,
      content,
      created_at: new Date().toISOString(),
      profiles: { full_name, avatar_url },
      optimistic: true
    };

    setComments((prev) => [optimisticComment, ...prev]);
    e.target.reset();

    // Submit to server
    try {
      const saved = await postComment(formData);
      setComments((prev) => prev.map((c) => (c.id === tempId ? saved : c)));
    } catch (err) {
      console.error("Failed to post comment:", err);
      setComments((prev) => prev.filter((c) => c.id !== tempId));
    }
  }

  // Login Form
  if (!user) {
    return (
      <section id="comment" className="mx-auto my-8 max-w-7xl px-4 md:px-8">
        <div className="border-border border p-4">
          <h3 className="text-base font-semibold">Sign in to Join the Conversation</h3>
          <p className="mb-4 text-sm">
            You’ll need to log in before posting a comment. It helps keep discussions thoughtful and
            authentic.
          </p>
          <form action={signInWithGoogle}>
            <input type="hidden" name="slug" value={slug} />
            <Button type="submit" className="cursor-pointer">
              <GoogleSolid className="size-5" />
              Login With Google
            </Button>
          </form>
        </div>

        <CommentList comments={comments} />
      </section>
    );
  }

  const { created_at } = user;
  const { avatar_url, full_name } = user.user_metadata;

  return (
    <section id="comment" className="mx-auto my-8 max-w-7xl px-4 md:px-8">
      <div className="border-border mb-4 border p-4">
        <h3 className="text-base font-semibold">Share Your Thoughts</h3>
        <p className="mb-4 text-sm">
          Every story invites a response. What stood out to you? What question or feeling did it
          leave behind? Your voice helps this reflection grow.
        </p>

        {/* User info */}
        <div className="my-4 flex justify-between">
          <div className="flex items-center gap-x-2">
            <Avatar>
              <AvatarImage src={avatar_url} />
              <AvatarFallback>{full_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="text-sm">{full_name}</h4>
              <p className="text-xs">
                Joined at: {formattedDateDayMonthYear(new Date(created_at))}
              </p>
            </div>
          </div>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              await signOut();
              setUser(null);
            }}
          >
            <Button
              type="submit"
              variant="destructive"
              className="cursor-pointer border-1 border-black text-xs"
            >
              Sign out
            </Button>
          </form>
        </div>

        {/* Comment form */}
        <form onSubmit={handleSubmit}>
          <textarea
            rows="4"
            className="mb-2 w-full border-1 border-black px-3 py-2 shadow-none outline-none focus:outline-none"
            id="comment"
            name="comment"
          ></textarea>
          <div>
            <Button type="submit" className="cursor-pointer">
              Post Comment
            </Button>
          </div>
        </form>
      </div>
      {/* Comment list */}
      <CommentList comments={comments} />
    </section>
  );
}

function CommentList({ comments }) {
  if (comments.length > 0) {
    return (
      <div className="border-border mt-4 border p-4">
        <h3 className="text-base font-semibold">Shared Thoughts</h3>
        <p className="mb-4 text-sm">
          Here{"'"}s how others have reflected on this piece - their thoughts, questions, and
          moments of resonance. Take a moment to read, connect, or add your own.
        </p>
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border p-3 transition-opacity">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src={comment.profiles?.avatar_url} />
                  <AvatarFallback>{comment.profiles?.full_name?.[0] || "?"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{comment.profiles?.full_name}</p>
                  <p className="text-xs">{formattedDateTime(new Date(comment.created_at))}</p>
                </div>
              </div>
              <p className="mt-2 text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
