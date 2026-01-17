import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "../dictionaries/dictionaries";
import { NavContent } from "./nav-content";

/**
 * Interface representing a navigation item.
 * @interface navItems
 * @property {string} name - The display name of the navigation item.
 * @property {string} path - The URL path associated with the navigation item.
 * @property {string} className - The CSS class applied to the navigation item.
 * @property {string} hoverClassName - The CSS class applied when the navigation item is hovered.
 */
export interface navItems {
  name: string;
  path: string;
  className: string;
  hoverClassName: string;
}

/**
 * Asynchronous React component for rendering the navigation bar.
 * @function Navbar
 * @async
 * @param {PageProps<"/[lang]">} props - The props object containing route parameters.
 * @returns {JSX.Element} The rendered navigation bar component.
 */
const Navbar = async ({
  params,
}: PageProps<"/[lang]">): Promise<React.JSX.Element> => {
  const { lang } = await params;

  // Check if the provided language is supported.
  if (!hasLocale(lang)) {
    return notFound();
  }

  // Retrieve the dictionary for the specified language.
  const dict = await getDictionary(lang);

  // Define the navigation items based on the dictionary.
  const navItems: navItems[] = [
    {
      name: dict.header.navbar.home,
      path: `/${lang}`,
      className: "decoration-home",
      hoverClassName: "hover:decoration-home",
    },
    {
      name: dict.header.navbar.newsletter,
      path: `/${lang}/newsletter`,
      className: "decoration-newsletter",
      hoverClassName: "hover:decoration-newsletter",
    },
    {
      name: dict.header.navbar.blog,
      path: `/${lang}/blog`,
      className: "decoration-blog",
      hoverClassName: "hover:decoration-blog",
    },
  ];

  // Render the navigation content using the NavContent component.
  return <NavContent navItems={navItems} />;
};

export default Navbar;
