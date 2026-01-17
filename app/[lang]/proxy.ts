import { getAvailableLocales } from "@/dictionaries/dictionaries";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { NextResponse } from "next/server";

const locales = getAvailableLocales();
const defaultLocale = "fr-FR";

/**
 * TypeScript interface for the headers property of the request.
 * Represents a collection of headers where each key maps to a string, an array of strings, or undefined.
 */
interface RequestHeaders {
  [key: string]: string | string[] | undefined;
}

/**
 * TypeScript interface for the request object.
 * Contains the headers and the nextUrl properties.
 */
interface Request {
  headers: RequestHeaders;
  nextUrl: URL;
}

/**
 * Determines the preferred locale for the user based on the request headers.
 *
 * @param {Request} request - The incoming request object containing headers and URL information.
 * @returns {string} - The best matching locale or the default locale if no match is found.
 */
function getLocale(request: Request): string {
  const negotiator = new Negotiator({ headers: request.headers });
  const languages = negotiator.languages();
  return match(languages, locales, defaultLocale);
}

/**
 * Middleware function to handle locale-based redirection.
 *
 * Checks if the requested URL already contains a supported locale. If not, it redirects the user
 * to the same URL prefixed with the best matching locale.
 *
 * @param {Request} request - The incoming request object containing headers and URL information.
 * @returns {NextResponse | undefined} - A redirection response if no locale is present in the URL, otherwise undefined.
 */
export function proxy(request: Request) {
  // Extract the pathname from the request URL
  const { pathname } = request.nextUrl;

  // Check if the pathname already contains a supported locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  // Determine the preferred locale and redirect the user
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl);
}

/**
 * Configuration object for the middleware matcher.
 * Specifies which paths the middleware should apply to.
 */
export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};
