/**
 * This file defines the RootLayout component for the application.
 * It sets up the global layout structure, including the header, footer, and main content area.
 * Additionally, it applies global font styles and metadata for the application.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { Locale } from "@/dictionaries/dictionaries";

/**
 * Configure the JetBrains Mono font with specific subsets and CSS variable.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-sans",
});

/**
 * Configure the Geist Sans font with specific subsets and CSS variable.
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

/**
 * Configure the Geist Mono font with specific subsets and CSS variable.
 */
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata for the application, including the base URL, title, and description.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL!),
  title: {
    template: "%s | William Perret",
    default: "William Perret | Étudiant en BUT Informatique",
  },
  description:
    "Portfolio et blog de William Perret, étudiant en développement web.",
};

/**
 * RootLayout component that defines the global layout structure of the application.
 *
 * @param {Object} props - The properties passed to the RootLayout component.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the layout.
 * @param {Promise<{ lang: string }>} props.params - A promise resolving to the language parameter.
 * @returns {JSX.Element} The RootLayout component.
 */
export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}>): Promise<React.JSX.Element> {
  const { lang } = await params;
  return (
    <html lang={lang} className={jetbrainsMono.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col justify-center items-center selection:bg-yellow-300/50`}
      >
        <Header
          params={params}
          searchParams={Promise.resolve<
            Record<string, string | string[] | undefined>
          >({})}
        />
        <main className="grow-0 flex justify-center items-center m-2 text-base">
          {children}
        </main>
        <Footer
          params={params}
          searchParams={Promise.resolve<
            Record<string, string | string[] | undefined>
          >({})}
        />
      </body>
    </html>
  );
}
