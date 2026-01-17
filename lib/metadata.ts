import { Metadata } from "next";
import {
  getDictionary,
  Locale,
  getAvailableLocales,
} from "@/dictionaries/dictionaries";

/**
 * A dictionary object containing metadata information.
 */
type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

/**
 * Keys of the metadata object within the dictionary.
 */
type MetadataKeys = keyof Dictionary["metadata"];

/**
 * Maps locales to their ISO string representation.
 */
const localeToIso: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
};

/**
 * Options for creating metadata.
 * @typedef {Object} MetadataOptions
 * @property {Locale} lang - The language locale.
 * @property {string} path - The path for the metadata.
 * @property {string} [title] - The title for the metadata.
 * @property {string} [description] - The description for the metadata.
 * @property {MetadataKeys} [dictKey] - The key to retrieve metadata from the dictionary.
 * @property {string} [image] - The URL of the image for metadata.
 */
interface MetadataOptions {
  lang: Locale;
  path: string;
  title?: string;
  description?: string;
  dictKey?: MetadataKeys;
  image?: string;
}

/**
 * Creates metadata for a given language and path.
 * @async
 * @function createMetadata
 * @param {MetadataOptions} options - The options for creating metadata.
 * @returns {Promise<Metadata>} The generated metadata object.
 */
export async function createMetadata({
  lang,
  path,
  title,
  description,
  dictKey,
  image,
}: MetadataOptions): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL!; // Base URL of the application
  const dict = await getDictionary(lang); // Fetch the dictionary for the given language
  const locales = getAvailableLocales(); // Retrieve available locales

  // Retrieve metadata from the dictionary if a key is provided
  const dictMetadata = dictKey ? dict.metadata[dictKey] : null;
  const finalTitle = title || dictMetadata?.title || "William Perret"; // Determine the final title
  const finalDescription = description || dictMetadata?.description || ""; // Determine the final description

  // Dynamically construct language-specific URLs
  const languages = Object.fromEntries(
    locales.map((l) => [localeToIso[l], `${baseUrl}/${l}${path}`]),
  );

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: `${baseUrl}/${lang}${path}`,
      languages: languages,
    },
    openGraph: {
      title: `${finalTitle} | William Perret`,
      description: finalDescription,
      url: `${baseUrl}/${lang}${path}`,
      locale: localeToIso[lang].replace("-", "_"),
      type: "website",
      images: [{ url: image || "/og-default.png" }],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      images: [image || "/og-default.png"],
    },
  };
}
