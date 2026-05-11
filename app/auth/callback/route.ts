import { NextResponse } from "next/server";

import { getPostAuthRedirectPath } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const supabase = createClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      email: data.user.email ?? null,
      updated_at: new Date().toISOString()
    })
    .eq("id", data.user.id);

  if (profileError) {
    return NextResponse.redirect(`${origin}/login`);
  }

  const nextPath = await getPostAuthRedirectPath(data.user.id);
  return NextResponse.redirect(`${origin}${nextPath}`);
}
