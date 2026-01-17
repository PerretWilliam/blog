import { getDictionary, hasLocale } from "@/dictionaries/dictionaries";
import { notFound } from "next/dist/client/components/navigation";
import React from "react";

/**
 * Footer component that displays a copyright message.
 *
 * @component
 * @returns {Promise<JSX.Element>} A div containing the copyright message with the current year.
 */
const Footer = async ({
  params,
}: PageProps<"/[lang]">): Promise<React.JSX.Element> => {
  const { lang } = await params;
  if (!hasLocale(lang)) {
    return notFound();
  }
  const dict = await getDictionary(lang);

  return (
    <div className="m-10">
      &copy; {new Date().getFullYear()} William Perret, {dict.footer.inspiredBy}
    </div>
  );
};

export default Footer;
