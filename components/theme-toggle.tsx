"use client";

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";

/**
 * Theme toggle component that allows users to switch between light and dark modes.
 * Persists the theme preference in localStorage and applies it to the document.
 *
 * @returns {React.JSX.Element} The rendered theme toggle button.
 */
export function ThemeToggle(): React.JSX.Element {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    // Use a microtask to defer the state update
    Promise.resolve().then(() => {
      setTheme(initialTheme);
      setMounted(true);
    });
  }, []);

  /**
   * Toggles between light and dark theme.
   * Updates localStorage and document class.
   */
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-lg border border-border bg-muted/30" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative h-9 w-9 rounded-lg border border-border bg-muted/30 transition-all duration-300 hover:bg-muted/60 hover:border-blog hover:shadow-md active:scale-95"
      aria-label={
        theme === "light" ? "Switch to dark mode" : "Switch to light mode"
      }
    >
      <div className="relative h-full w-full overflow-hidden">
        <IconSun
          size={18}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-500 transition-all duration-500 ${
            theme === "light"
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
          strokeWidth={2}
        />
        <IconMoon
          size={18}
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-400 transition-all duration-500 ${
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
          strokeWidth={2}
        />
      </div>
    </button>
  );
}
