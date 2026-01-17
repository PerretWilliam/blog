import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAvailableLocales } from "./dictionaries/dictionaries";

const locales = getAvailableLocales();
const defaultLocale = "fr";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  request.nextUrl.pathname = `/${defaultLocale}${pathname}`;

  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)",
  ],
};
