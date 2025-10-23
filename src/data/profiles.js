"use server";

import { createClient } from "@/lib/supabase/server";

export async function getUser() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  const { user } = data;

  return user || null;
}
