"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navItems } from "./navbar";

/**
 * Navigation content component that renders a list of navigation items as links.
 *
 * @param {Object} props - The props object.
 * @param {Array} props.navItems - An array of navigation items to display.
 * @param {string} props.navItems[].name - The name of the navigation item.
 * @param {string} props.navItems[].path - The path the navigation item links to.
 * @param {string} [props.navItems[].className] - Additional CSS classes for the active navigation item.
 * @param {string} [props.navItems[].hoverClassName] - Additional CSS classes for the navigation item on hover.
 * @returns {JSX.Element} The rendered navigation content.
 */
export const NavContent = ({
  navItems,
}: {
  navItems: navItems[];
}): React.JSX.Element => {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex list-none p-4">
        {navItems.map((item) => (
          <li key={item.name} className="mr-4">
            <Link
              href={item.path}
              className={`${
                pathname === item.path
                  ? `font-bold underline ${item.className} decoration-3`
                  : `font-normal no-underline hover:underline ${item.hoverClassName} hover:decoration-3 hover:font-bold`
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
