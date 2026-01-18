/**
 * Imports the dictionary and locale types, as well as necessary components and icons.
 */
import { getDictionary, Locale } from "@/dictionaries/dictionaries";
import { Container } from "@/components/container";
import { NewsletterForm } from "@/components/newsletter-form";
import {
  IconMail,
  IconSend,
  IconShieldCheck,
  IconSparkles,
} from "@tabler/icons-react";
import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";

/**
 * Generates metadata for the newsletter page.
 *
 * @param {Object} params - The parameters object.
 * @param {Promise<{ lang: Locale }>} params.params - A promise resolving to the language locale.
 * @returns {Promise<Object>} Metadata for the page.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;

  return createMetadata({
    lang,
    path: "/",
    dictKey: "newsletter",
  });
}

/**
 * Renders the newsletter page.
 *
 * @param {Object} params - The parameters object.
 * @param {Promise<{ lang: Locale }>} params.params - A promise resolving to the language locale.
 * @returns {JSX.Element} The rendered newsletter page.
 */
export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<React.JSX.Element> {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  /**
   * List of benefits displayed on the page.
   * Each benefit includes an icon, title, and description.
   */
  const benefits = [
    {
      icon: <IconSend className="text-newsletter" size={24} />,
      title: dict.newsletter.benefits[0].title,
      desc: dict.newsletter.benefits[0].desc,
    },
    {
      icon: <IconSparkles className="text-newsletter" size={24} />,
      title: dict.newsletter.benefits[1].title,
      desc: dict.newsletter.benefits[1].desc,
    },
    {
      icon: <IconShieldCheck className="text-newsletter" size={24} />,
      title: dict.newsletter.benefits[2].title,
      desc: dict.newsletter.benefits[2].desc,
    },
  ];

  return (
    <Container size="prose" className="py-20">
      <div className="flex flex-col items-center text-center space-y-6">
        {/* Icon and Title */}
        <div className="p-4 bg-newsletter/10 rounded-full text-newsletter mb-2">
          <IconMail size={48} stroke={1.5} />
        </div>

        <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
          {dict.newsletter.title}
        </h1>

        <p className="text-lg text-muted-foreground leading-relaxed">
          {dict.newsletter.description}
        </p>

        {/* The Form (Client Utility) */}
        <div className="w-full pt-6 flex justify-center">
          <NewsletterForm lang={lang} dict={dict} />
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 gap-8 w-full pt-16 text-left border-t mt-16">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-4">
              <div className="shrink-0 pt-1">{benefit.icon}</div>
              <div>
                <h3 className="font-bold text-lg">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground pt-10 italic">
          {dict.newsletter.footer}
        </p>
      </div>
    </Container>
  );
}
