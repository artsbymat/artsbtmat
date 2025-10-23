"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "./profiles";

export async function postComment(formData) {
  const user = await getUser();

  if (!user) {
    throw new Error("Unauthorized: You must be logged in to post a comment.");
  }

  const comment = formData.get("comment");
  const slug = formData.get("slug");

  if (!comment || !slug) {
    throw new Error("Invalid input: Comment or slug is missing.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        user_id: user.id,
        slug,
        content: comment.trim()
      }
    ])
    .select(
      `
      id,
      content,
      slug,
      created_at,
      user_id,
      profiles:user_id (
        full_name,
        avatar_url
      )
    `
    )
    .single();

  if (error) {
    console.error("Error inserting comment:", error);
    throw new Error("Failed to post comment. Please try again.");
  }

  return data;
}

export async function getCommentsBySlug(slug) {
  if (!slug) throw new Error("Slug is required.");

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      id,
      content,
      created_at,
      user_id,
      profiles: user_id (
        full_name,
        avatar_url
      )
    `
    )
    .eq("slug", slug)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to load comments.");
  }

  return data || [];
}
