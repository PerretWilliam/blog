import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into a localized string with the format "MMM. DD, YYYY".
 *
 * @param {Date | string} date - The date to format. Can be a `Date` object or a string representation of a date.
 * @param {string} lang - The language code (e.g., "en", "fr") for localization.
 * @returns {string} - The formatted date string. Returns "Invalid Date" if the input is not a valid date.
 */
export function formatDate(date: Date | string, lang: string): string {
  const d = typeof date === "string" ? new Date(date) : date;

  if (isNaN(d.getTime())) return "Invalid Date";

  let monthName = d.toLocaleDateString(lang, { month: "short" });

  monthName =
    monthName.charAt(0).toUpperCase() + monthName.slice(1).replace(".", "");

  const day = String(d.getDate()).padStart(2, "0");
  const year = d.getFullYear();

  return `${monthName}. ${day}, ${year}`;
}
