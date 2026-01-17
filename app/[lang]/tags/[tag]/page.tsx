import { getAllPosts, Post } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Separator } from "@/components/ui/separator";
import { IconTag } from "@tabler/icons-react";
import { notFound } from "next/navigation";
import {
  getAvailableLocales,
  getDictionary,
  hasLocale,
  Locale,
} from "@/dictionaries/dictionaries";
import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

/**
 * Generates metadata for the tag page.
 *
 * @async
 * @function generateMetadata
 * @param {Object} params - The parameters for the function.
 * @param {Promise<{ lang: Locale; tag: string }>} params.params - The language and tag parameters.
 * @returns {Promise<Object>} The metadata object for the tag page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; tag: string }>;
}): Promise<Metadata> {
  const { lang, tag } = await params;

  const decodedTag = decodeURIComponent(tag);

  const dict = await getDictionary(lang);

  return createMetadata({
    lang,
    path: `/tags/${tag}`,
    title: dict.metadata.tags.title.replace("{decodedTag}", decodedTag),
    description: dict.metadata.tags.description.replace(
      "{decodedTag}",
      decodedTag,
    ),
  });
}

/**
 * Generates static parameters for the tag pages.
 *
 * @async
 * @function generateStaticParams
 * @returns {Promise<Array<{ lang: Locale; tag: string }>>} An array of language and tag combinations.
 */
export async function generateStaticParams(): Promise<
  Array<{ lang: Locale; tag: string }>
> {
  // Retrieve all available locales (e.g., ['fr', 'en'])
  const languages: Locale[] = getAvailableLocales();

  const paths = [];

  for (const lang of languages) {
    const posts = getAllPosts(lang);
    const tags = new Set(posts.flatMap((post) => post.tags || []));

    for (const tag of tags) {
      paths.push({
        lang: lang,
        tag: tag,
      });
    }
  }

  return paths;
}

/**
 * Renders the tag page.
 *
 * @async
 * @function TagPage
 * @param {Object} params - The parameters for the function.
 * @param {Promise<{ lang: string; tag: string }>} params.params - The language and tag parameters.
 * @returns {Promise<JSX.Element>} The JSX element for the tag page.
 */
export default async function TagPage({
  params,
}: {
  params: Promise<{ lang: string; tag: string }>;
}): Promise<React.JSX.Element> {
  const { lang, tag } = await params;

  if (!hasLocale(lang)) {
    return notFound();
  }

  const dict = await getDictionary(lang);
  const allPosts = getAllPosts(lang);

  const decodedTag = decodeURIComponent(tag);
  const filteredPosts = allPosts.filter((post) =>
    post.tags?.some((t) => t.toLowerCase() === decodedTag.toLowerCase()),
  );

  if (filteredPosts.length === 0) {
    return (
      <div className="container py-10 max-w-2xl">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-primary mb-2">
            <IconTag size={20} />
            <span className="text-sm font-bold uppercase tracking-wider">
              Tag
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight capitalize">
            {decodedTag}
          </h1>
        </header>
        <p className="text-center text-muted-foreground py-20">
          {dict.blog.noPosts}
        </p>
      </div>
    );
  }

  const postsByYear = filteredPosts.reduce(
    (acc, post) => {
      const year = post.date.getFullYear().toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    },
    {} as Record<string, Post[]>,
  );

  const years = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="container py-10 max-w-2xl">
      <header className="mb-12">
        <div className="flex items-center gap-2 text-primary mb-2">
          <IconTag size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">
            {dict.tags.tags}
          </span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight capitalize">
          {decodedTag}
        </h1>
        <p className="text-muted-foreground mt-2">
          {filteredPosts.length} {dict.tags.articlesFound}
        </p>
      </header>

      <div className="space-y-16">
        {years.map((year) => (
          <section key={year}>
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-2xl font-semibold">{year}</h2>
              <Separator className="flex-1" />
            </div>

            <div className="grid grid-cols-1 gap-6">
              {postsByYear[year].map((post) => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  description={post.description}
                  tags={post.tags || []}
                  slug={post.slug}
                  lang={lang}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
