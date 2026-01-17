import Link from "next/link";
import { formatDate } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconArrowRight, IconCalendar, IconTag } from "@tabler/icons-react";
import { getDictionary, Locale } from "@/dictionaries/dictionaries";

interface PostCardProps {
  title: string;
  date: string | Date;
  description: string;
  slug: string;
  lang: Locale;
  tags: string[];
}

/**
 * PostCard is a React component that renders a card UI for a blog post.
 * It uses the "Pseudo-content" trick to avoid nested <a> tags.
 *
 * @async
 * @function PostCard
 * @param {PostCardProps} props - The props object containing the post details.
 * @returns {Promise<React.JSX.Element>} The rendered PostCard component.
 */
export async function PostCard({
  title,
  date,
  description,
  slug,
  lang,
  tags,
}: PostCardProps): Promise<React.JSX.Element> {
  const dict = await getDictionary(lang);

  return (
    <div className="group relative h-full">
      <Card className="flex h-full flex-col transition-all duration-300 group-hover:border-blog group-hover:shadow-lg">
        <CardHeader className="space-y-4">
          {/* Header Responsive: Stacked on mobile, side-by-side on sm */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge variant="secondary" className="text-[10px] uppercase">
              {lang}
            </Badge>
            <div className="flex items-center text-xs text-muted-foreground">
              <IconCalendar className="mr-1 h-3 w-3" />
              {formatDate(date, lang)}
            </div>
          </div>

          <CardTitle className="leading-tight">
            {/* The main link uses the "after" pseudo-element to cover the whole card */}
            <Link
              href={`/${lang}/post/${slug}`}
              className="decoration-blog decoration-3 underline-offset-4 hover:underline focus:outline-none after:absolute after:inset-0 after:z-10"
            >
              {title}
            </Link>
          </CardTitle>
        </CardHeader>

        <CardContent className="grow">
          <CardDescription className="mb-4 line-clamp-3">
            {description}
          </CardDescription>

          {/* Tags Section: Higher z-index to stay clickable over the main link */}
          <div className="relative z-20 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/${lang}/tags/${tag}`}
                className="inline-flex"
              >
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 text-[10px] transition-colors hover:bg-blog hover:text-primary-foreground"
                >
                  <IconTag size={10} />
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <div className="flex items-center text-sm font-medium text-blog transition-opacity opacity-0 group-hover:opacity-100">
            {dict.blog.readArticle} <IconArrowRight className="ml-1 h-4 w-4" />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
