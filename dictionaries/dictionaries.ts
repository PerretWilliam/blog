import "server-only";

/**
 * A collection of dictionaries for different locales.
 * Each dictionary is dynamically imported based on the locale.
 */
const dictionaries = {
  /**
   * English dictionary loader.
   * Dynamically imports the English dictionary JSON file.
   * @returns {Promise<object>} A promise that resolves to the English dictionary.
   */
  en: () => import("./en.json").then((module) => module.default),

  /**
   * French dictionary loader.
   * Dynamically imports the French dictionary JSON file.
   * @returns {Promise<object>} A promise that resolves to the French dictionary.
   */
  fr: () => import("./fr.json").then((module) => module.default),
};

/**
 * Type representing the available locales.
 * Derived from the keys of the `dictionaries` object.
 */
export type Locale = keyof typeof dictionaries;

/**
 * Checks if a given string is a valid locale.
 * @param {string} locale - The locale string to check.
 * @returns {boolean} True if the locale exists in the dictionaries, false otherwise.
 */
export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

/**
 * Retrieves the dictionary for a given locale.
 * @async
 * @param {Locale} locale - The locale for which to retrieve the dictionary.
 * @returns {Promise<object>} A promise that resolves to the dictionary for the specified locale.
 */
export const getDictionary = async (locale: Locale) => dictionaries[locale]();

/** Export Dictionary type */
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

/**
 * Retrieves the list of available locales.
 * @returns {Locale[]} An array of available locale keys.
 */
export const getAvailableLocales = (): Locale[] =>
  Object.keys(dictionaries) as Locale[];
