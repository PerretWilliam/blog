import { getDictionary, Locale } from "@/dictionaries/dictionaries";
import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import {
  IconBrandGithub,
  IconCoffee,
  IconMail,
  IconArrowRight,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { Container } from "@/components/container";
import { NewsletterForm } from "@/components/newsletter-form";
import { createMetadata } from "@/lib/metadata";

/**
 * Generates metadata for the page.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Promise<{ lang: Locale }>} params.params - A promise resolving to the locale parameter.
 * @returns {Promise<Object>} Metadata object for the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  return createMetadata({
    lang,
    path: "/",
    dictKey: "home",
  });
}

/**
 * The main page component.
 *
 * @param {Object} params - The parameters for the component.
 * @param {Promise<{ lang: Locale }>} params.params - A promise resolving to the locale parameter.
 * @returns {JSX.Element} The rendered page component.
 */
export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;

  const dict = await getDictionary(lang);
  const recentPosts = getAllPosts(lang).slice(0, 3);

  return (
    /* FIX: Ensure Container has horizontal padding (px-4 sm:px-6) 
       to prevent content from touching the screen edges.
    */
    <Container className="space-y-20 pb-10 px-4 sm:px-6">
      {/* SECTION 1: HERO / ABOUT */}
      <section className="flex flex-col items-center gap-5 pt-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          {dict.home.title}
        </h1>
        {/* max-w-2xl is better for readability than a custom large value */}
        <p className="text-base text-muted-foreground max-w-2xl sm:text-lg">
          {dict.home.bio}
        </p>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm sm:text-base">
          <Link
            href="https://github.com/PerretWilliam"
            target="_blank"
            className="flex items-center gap-2 hover:underline hover:decoration-primary hover:decoration-3"
          >
            <IconBrandGithub className="h-4 w-4" /> GitHub
          </Link>

          <Link
            href="https://buymeacoffee.com/perretwilliam"
            target="_blank"
            className="flex items-center gap-2 hover:underline hover:decoration-primary hover:decoration-3"
          >
            <IconCoffee className="h-4 w-4" /> Buy me a coffee
          </Link>

          <Link
            href="https://william-perret.fr"
            target="_blank"
            className="flex items-center gap-2 hover:underline hover:decoration-primary hover:decoration-3"
          >
            <IconUser className="h-4 w-4" /> Portfolio
          </Link>
        </div>
      </section>

      {/* SECTION 2: RECENT POSTS */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold sm:text-2xl">
            {dict.home.recentPosts}
          </h2>

          <Link
            href={`/${lang}/blog`}
            className="flex items-center gap-1 text-sm font-medium hover:decoration-3 hover:decoration-blog hover:underline  sm:text-base"
          >
            {dict.home.seeAll} <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <PostCard
              key={post.slug}
              {...post}
              lang={lang}
              tags={post.tags || []}
            />
          ))}
        </div>
      </section>

      {/* SECTION 3: NEWSLETTER */}
      <section className="rounded-2xl border border-newsletter bg-muted/20 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold italic flex items-center gap-2">
              <IconMail className="text-newsletter" /> {dict.newsletter.title}
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              {dict.newsletter.description}
            </p>
          </div>
          <div className="w-full lg:w-auto shrink-0">
            <NewsletterForm cta={dict.newsletter.cta} lang={lang} />
          </div>
        </div>
      </section>
    </Container>
  );
}
