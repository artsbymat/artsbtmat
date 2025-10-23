"use server";

import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function signInWithGoogle(formData) {
  const supabase = await createClient();

  const currentPosts = formData.get("slug");

  const auth_callback_url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback?redirectTo=${encodeURIComponent(
    currentPosts
  )}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: auth_callback_url
    }
  });

  if (error) {
    console.error(error);
  }

  if (data) {
    redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
