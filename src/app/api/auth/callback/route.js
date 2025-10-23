import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const redirectTo = searchParams.get("redirectTo") || "/";
  const code = searchParams.get("code");

  let destination = "/";
  if (redirectTo.startsWith("/")) {
    destination = redirectTo;
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      const baseUrl = isLocalEnv ? origin : forwardedHost ? `https://${forwardedHost}` : origin;

      return NextResponse.redirect(`${baseUrl}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/api/auth/auth-code-error`);
}
