import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DEFAULT_BASE = "http://localhost:3000";

async function listPostUrls(baseUrl: string) {
  const postsDir = path.join(process.cwd(), "content", "posts");
  try {
    const locales = await fs.readdir(postsDir);
    const urls: string[] = [];

    for (const locale of locales) {
      const localeDir = path.join(postsDir, locale);
      const stat = await fs.stat(localeDir).catch(() => null);
      if (!stat || !stat.isDirectory()) continue;

      const files = await fs.readdir(localeDir).catch(() => []);
      for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const slug = file.replace(/\.md$/, "");
        urls.push(`${baseUrl}/${locale}/post/${slug}`);
      }
    }

    return urls;
  } catch (e) {
    console.error("Error listing post URLs:", e);
    return [];
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || DEFAULT_BASE;

  const staticPaths = ["", "blog", "newsletter"];
  const locales = ["en", "fr"];

  const urls = new Set<string>();

  // add localized static pages
  for (const locale of locales) {
    for (const p of staticPaths) {
      const suffix = p ? `/${p}` : "";
      urls.add(`${baseUrl}/${locale}${suffix}`);
    }
  }

  // add posts
  const postUrls = await listPostUrls(baseUrl);
  postUrls.forEach((u) => urls.add(u));

  const urlEntries = Array.from(urls)
    .map((u) => `  <url>\n    <loc>${u}</loc>\n  </url>`)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

export const runtime = "nodejs";
