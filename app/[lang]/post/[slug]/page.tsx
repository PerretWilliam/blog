import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SizeSelector } from "@/components/size-selector";
import { sizeClasses } from "@/constant/size";
import Link from "next/link";
import {
  extractHeadings,
  getPostBySlug,
  getPostContent,
  getPostNavigation,
} from "@/lib/posts";
import {
  IconArrowLeft,
  IconArrowRight,
  IconDice,
  IconTag,
} from "@tabler/icons-react";
import { getDictionary, Locale } from "@/dictionaries/dictionaries";
import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { CodeCopyManager } from "@/components/code-copy-manager";
import { TableOfContents } from "@/components/table-of-contents";

/**
 * Generates metadata for a post page.
 *
 * @param {Object} params - The parameters for metadata generation.
 * @param {Promise<{ slug: string; lang: Locale }>} params.params - The slug and language of the post.
 * @returns {Promise<Metadata>} The metadata for the post page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; lang: Locale }>;
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const post = getPostBySlug(slug, lang);
  if (!post)
    return createMetadata({ lang, path: `/post/${slug}`, title: "Not Found" });

  return createMetadata({
    lang,
    path: `/post/${slug}`,
    title: post.title,
    description: post.description,
    image: post.image,
  });
}

/**
 * Renders the post page.
 *
 * @param {Object} props - The properties for the post page.
 * @param {Promise<{ slug: string; lang: Locale }>} props.params - The slug and language of the post.
 * @param {Promise<{ size?: string }>} props.searchParams - The search parameters, including size.
 * @returns {Promise<React.JSX.Element>} The JSX element for the post page.
 */
export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; lang: Locale }>;
  searchParams: Promise<{ size?: string }>;
}): Promise<React.JSX.Element> {
  const { slug, lang } = await params;
  const { size } = await searchParams;

  const post = getPostBySlug(slug, lang);
  if (!post) return notFound();

  const dict = await getDictionary(lang);

  const filePath = path.join(
    process.cwd(),
    "content/posts",
    lang,
    `${slug}.md`,
  );
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(fileContent);
  const headings = extractHeadings(content);

  const contentHtml = await getPostContent(content);
  const { nextPost, prevPost, randomPost } = getPostNavigation(slug, lang);
  const selectedSize = sizeClasses[size as string] || "prose-base";

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <CodeCopyManager />

      <div className="lg:grid lg:grid-cols-[1fr_672px_1fr] lg:gap-12 lg:items-start">
        <aside className="hidden lg:block sticky top-24 w-full justify-self-end pr-4">
          <TableOfContents
            headings={headings}
            title={dict.post.toc}
            isSidebar
          />
        </aside>

        <div className="w-full min-w-0 max-w-2xl mx-auto lg:mx-0">
          <header className="mb-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl wrap-break-word hyphens-auto">
              {post.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground italic sm:text-base">
                {formatDate(post.date, lang)}
              </p>
              <SizeSelector lang={lang} />
            </div>

            {post.tags && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    href={`/${lang}/tags/${tag}`}
                    className="text-xs font-medium underline decoration-blog decoration-2 underline-offset-4 hover:font-bold sm:text-sm"
                    key={tag}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </header>

          <Separator className="my-6 w-full" />

          <div className="mb-8 lg:hidden">
            <TableOfContents headings={headings} title={dict.post.toc} />
          </div>

          <div
            className={`prose dark:prose-invert w-full max-w-none ${selectedSize} 
              prose-pre:overflow-x-auto prose-img:rounded-xl prose-img:w-full wrap-break-word`}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <footer className="mt-16 space-y-10">
            <Separator className="w-full" />

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div className="flex flex-col gap-8 w-full">
                {prevPost && (
                  <Link
                    href={`/${lang}/post/${prevPost.slug}`}
                    className="group flex flex-col items-start gap-1 w-full"
                  >
                    <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <IconArrowLeft size={14} /> {dict.post.previous}
                    </span>
                    <span className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-blog">
                      {prevPost.title}
                    </span>
                  </Link>
                )}

                {nextPost && (
                  <Link
                    href={`/${lang}/post/${nextPost.slug}`}
                    className="group flex flex-col items-start sm:items-end gap-1 w-full sm:text-right"
                  >
                    <span className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      {dict.post.next} <IconArrowRight size={14} />
                    </span>
                    <span className="line-clamp-2 text-sm font-medium transition-colors group-hover:text-blog">
                      {nextPost.title}
                    </span>
                  </Link>
                )}
              </div>

              {randomPost && (
                <div className="flex items-center justify-center sm:justify-end">
                  <Link
                    href={`/${lang}/post/${randomPost.slug}`}
                    className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-muted hover:text-blog transition-colors"
                  >
                    <IconDice size={18} /> {dict.post.randomPost}
                  </Link>
                </div>
              )}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-col items-center gap-4 border-t pt-8">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  <IconTag size={14} /> {dict.post.tags}
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  {post.tags.map((tag: string) => (
                    <Link
                      href={`/${lang}/tags/${tag}`}
                      className="text-sm underline decoration-blog decoration-2 underline-offset-4 hover:text-blog"
                      key={tag}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </footer>
        </div>
        <div className="hidden lg:block" />
      </div>
    </article>
  );
}
