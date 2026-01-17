import { Locale } from "@/dictionaries/dictionaries";

/**
 * A mapping of size keys to their corresponding CSS classes.
 * These classes are used to define the size of text elements.
 *
 * @type {Record<string, string>}
 * @property {string} sm - Small text size class.
 * @property {string} base - Base (normal) text size class.
 * @property {string} lg - Large text size class.
 * @property {string} xl - Extra large text size class.
 */
export const sizeClasses: Record<string, string> = {
  sm: "prose-sm",
  base: "prose-base",
  lg: "prose-lg",
  xl: "prose-xl",
};

/**
 * A mapping of locales to their respective size labels and text descriptions.
 * This is used for localization of size-related labels in the application.
 *
 * @type {Record<Locale, Record<string, string>>}
 * @property {Record<string, string>} fr - French locale labels.
 * @property {string} fr.text - Label for "Text" in French.
 * @property {string} fr.sm - Label for "Small" in French.
 * @property {string} fr.base - Label for "Normal" in French.
 * @property {string} fr.lg - Label for "Large" in French.
 * @property {string} fr.xl - Label for "Extra Large" in French.
 * @property {Record<string, string>} en - English locale labels.
 * @property {string} en.text - Label for "Text" in English.
 * @property {string} en.sm - Label for "Small" in English.
 * @property {string} en.base - Label for "Normal" in English.
 * @property {string} en.lg - Label for "Large" in English.
 * @property {string} en.xl - Label for "Extra Large" in English.
 */
export const sizeLabels: Record<Locale, Record<string, string>> = {
  fr: {
    text: "Texte",
    sm: "Petit",
    base: "Normal",
    lg: "Grand",
    xl: "Très grand",
  },
  en: {
    text: "Text",
    sm: "Small",
    base: "Normal",
    lg: "Large",
    xl: "Extra Large",
  },
};
