import Image from "next/image";
import Navbar from "./navbar";
import { ThemeToggle } from "./theme-toggle";
import { getDictionary, hasLocale } from "@/dictionaries/dictionaries";
import { notFound } from "next/navigation";

/**
 * Header component that displays the header section of the page.
 * Includes the site title, bio, profile image, theme toggle, and navigation bar.
 *
 * @param {PageProps<"/[lang]">} props - The props object containing the `params` property.
 * @returns {Promise<React.JSX.Element>} The rendered header component.
 */
const Header = async ({
  params,
}: PageProps<"/[lang]">): Promise<React.JSX.Element> => {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    return notFound();
  }
  const dict = await getDictionary(lang);

  return (
    <>
      <div className="relative mx-auto max-w-4xl mt-12 px-6">
        <div className="absolute top-0 right-6">
          <ThemeToggle />
        </div>

        <div className="flex flex-col-reverse items-center sm:flex-row sm:justify-center gap-10 lg:gap-16">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              William Perret
            </h1>
            <p className="mt-4 max-w-xs text-lg text-muted-foreground sm:max-w-sm sm:text-xl lg:leading-relaxed">
              {dict.header.about}
            </p>
          </div>
          <div className="shrink-0">
            <Image
              src="/img/profile.jpeg"
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover shadow-2xl ring-4 ring-border/40 sm:h-44 sm:w-44 lg:h-52 lg:w-52"
              width={208}
              height={208}
              priority
            />
          </div>
        </div>
      </div>

      <Navbar
        params={params}
        searchParams={Promise.resolve<
          Record<string, string | string[] | undefined>
        >({})}
      />
    </>
  );
};

export default Header;
