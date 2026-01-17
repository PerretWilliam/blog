import Link from "next/link";

interface Heading {
  level: number;
  text: string;
  id: string;
}

export function TableOfContents({
  headings,
  title,
  isSidebar = false,
}: {
  headings: Heading[];
  title: string;
  isSidebar?: boolean;
}) {
  if (headings.length === 0) return null;

  return (
    <nav
      className={
        isSidebar
          ? "w-full" // Style sidebar : pas de boite
          : "mb-8 rounded-xl border border-border bg-muted/30 p-5" // Style classique mobile
      }
    >
      <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h2>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 1.5}rem` }}
          >
            <Link
              href={`#${heading.id}`}
              className="text-sm text-foreground/80 transition-colors hover:text-blog hover:underline decoration-2 underline-offset-4"
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
