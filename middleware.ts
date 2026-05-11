import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  defaultLocale,
  detectLocaleFromHeader,
  localeCookieName,
  resolveLocale
} from "@/i18n";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/");
  const localeFromPath = resolveLocale(segments[1]);

  let response: NextResponse;

  if (localeFromPath) {
    const redirectUrl = request.nextUrl.clone();
    const nextPath = pathname.replace(`/${localeFromPath}`, "") || "/";
    redirectUrl.pathname = nextPath;
    response = NextResponse.redirect(redirectUrl);
    response.cookies.set(localeCookieName, localeFromPath, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });
    return updateSession(request, response);
  }

  const cookieLocale = resolveLocale(request.cookies.get(localeCookieName)?.value);
  const headerLocale = detectLocaleFromHeader(request.headers.get("accept-language"));
  const locale = cookieLocale ?? headerLocale ?? defaultLocale;

  response = NextResponse.next();
  if (cookieLocale !== locale) {
    response.cookies.set(localeCookieName, locale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  return updateSession(request, response);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
