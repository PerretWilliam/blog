import { getAllPosts, Post } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { Separator } from "@/components/ui/separator";
import { getDictionary, hasLocale, Locale } from "@/dictionaries/dictionaries";
import { notFound } from "next/navigation"; // Corrected import
import { createMetadata } from "@/lib/metadata";

/**
 * Generates metadata for the blog page.
 *
 * @async
 * @function generateMetadata
 * @param {Object} params - The parameters object containing the locale.
 * @param {Promise<{ lang: Locale }>} params.params - A promise resolving to an object with the locale.
 * @returns {Promise<Object>} The metadata object for the blog page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<ReturnType<typeof createMetadata>> {
  const { lang } = await params;

  return createMetadata({
    lang,
    path: "/blog",
    dictKey: "blog",
  });
}

/**
 * Renders the blog page with posts grouped by year.
 *
 * @async
 * @function page
 * @param {Object} params - The parameters object containing the locale.
 * @param {Promise<{ lang: string }>} params.params - A promise resolving to an object with the locale.
 * @returns {Promise<JSX.Element>} The JSX element representing the blog page.
 */
export default async function page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  // Check if the locale is valid, otherwise return a 404 page.
  if (!hasLocale(lang)) {
    return notFound();
  }

  // Fetch the dictionary for the given locale.
  const dict = await getDictionary(lang);

  // Retrieve all posts for the given locale.
  const allPosts = getAllPosts(lang);

  // Group posts by year.
  const postsByYear = allPosts.reduce(
    (acc, post) => {
      const year = post.date.getFullYear().toString();
      if (!acc[year]) acc[year] = [];
      acc[year].push(post);
      return acc;
    },
    {} as Record<string, Post[]>,
  );

  // Sort years in descending order.
  const years = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a));

  return (
    /* FIX: Added 'px-4' for mobile and 'sm:px-6' for larger screens. 
       'mx-auto' ensures it stays centered as the screen grows.
    */
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          {dict.blog.description}
        </p>
      </header>

      <div className="space-y-16">
        {years.map((year) => (
          <section key={year}>
            <div className="mb-8 flex items-center gap-4">
              <h2 className="text-xl font-semibold sm:text-2xl">{year}</h2>
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
                  lang={lang as Locale}
                />
              ))}
            </div>
          </section>
        ))}

        {allPosts.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">
            {dict.blog.noPosts}
          </p>
        )}
      </div>
    </div>
  );
}
