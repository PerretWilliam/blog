import { NextResponse } from "next/server";

const DEFAULT_BASE = "http://localhost:3000";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_BASE;
  const body = `User-agent: *\nAllow: /\nSitemap: ${baseUrl}/sitemap.xml\n`;

  return new NextResponse(body, {
    headers: { "Content-Type": "text/plain" },
  });
}

export const runtime = "nodejs";
