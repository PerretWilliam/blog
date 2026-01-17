import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import GithubSlugger from "github-slugger";

/**
 * Interface représentant un article de blog.
 * @interface Post
 * @property {string} slug - Identifiant unique de l'article.
 * @property {string} title - Titre de l'article.
 * @property {Date} date - Date de publication de l'article.
 * @property {string} description - Description courte de l'article.
 * @property {string[]} [tags] - Liste des tags associés à l'article.
 * @property {string} lang - Langue de l'article.
 * @property {string} [image] - URL de l'image associée à l'article.
 */
export interface Post {
  slug: string;
  title: string;
  date: Date;
  description: string;
  tags?: string[];
  lang: string;
  image?: string;
}

const postsDirectory = path.join(process.cwd(), "content/posts");

/**
 * Récupère un article de blog à partir de son slug et de sa langue.
 * @function getPostBySlug
 * @param {string} slug - Identifiant unique de l'article.
 * @param {string} lang - Langue de l'article.
 * @returns {Post | null} L'article correspondant ou null s'il n'existe pas.
 */
export function getPostBySlug(slug: string, lang: string): Post | null {
  const filePath = path.join(postsDirectory, lang, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  return {
    slug,
    title: data.title,
    date: data.date instanceof Date ? data.date : new Date(data.date),
    description: data.description,
    tags: data.tags || [],
    lang,
    image: data.image || "/og-default.png",
  };
}

/**
 * Récupère tous les articles de blog pour une langue donnée.
 * @function getAllPosts
 * @param {string} lang - Langue des articles.
 * @returns {Post[]} Liste des articles triés par date décroissante.
 */
export function getAllPosts(lang: string): Post[] {
  const langDirectory = path.join(postsDirectory, lang);
  if (!fs.existsSync(langDirectory)) return [];
  const filenames = fs.readdirSync(langDirectory);

  return filenames
    .filter((name) => name.endsWith(".md"))
    .map((filename) => getPostBySlug(filename.replace(".md", ""), lang)!)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

/**
 * Transforme le contenu Markdown d'un article en HTML.
 * @async
 * @function getPostContent
 * @param {string} content - Contenu Markdown de l'article.
 * @returns {Promise<string>} Contenu HTML transformé.
 */
export async function getPostContent(content: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: {
        light: "catppuccin-latte",
        dark: "catppuccin-macchiato",
      },
      keepBackground: true,
      grid: true,
    })
    .use(rehypeStringify)
    .process(content);

  return result.toString();
}

/**
 * Génère la navigation entre les articles (précédent, suivant, aléatoire).
 * @function getPostNavigation
 * @param {string} slug - Identifiant unique de l'article actuel.
 * @param {string} lang - Langue des articles.
 * @returns {Object} Navigation entre les articles.
 * @property {Post | null} nextPost - Article suivant.
 * @property {Post | null} prevPost - Article précédent.
 * @property {Post | null} randomPost - Article aléatoire.
 */
export function getPostNavigation(slug: string, lang: string) {
  const allPosts = getAllPosts(lang);
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);

  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const prevPost =
    currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const otherPosts = allPosts.filter((p) => p.slug !== slug);
  const seed = slug
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomPost =
    otherPosts.length > 0 ? otherPosts[seed % otherPosts.length] : null;

  return { nextPost, prevPost, randomPost };
}

/**
 * Extracts headings from the given Markdown content.
 * @function extractHeadings
 * @param {string} content - The Markdown content to extract headings from.
 * @returns {Array<{ level: number, text: string, id: string }>} An array of heading objects, each containing:
 *  - `level` (number): The heading level (e.g., 2 for H2, 3 for H3).
 *  - `text` (string): The text of the heading.
 *  - `id` (string): The slugified ID of the heading.
 */
export function extractHeadings(
  content: string,
): Array<{ level: number; text: string; id: string }> {
  const slugger = new GithubSlugger(); // Create a slugger instance for this content
  const headingLines = content
    .split("\n")
    .filter((line) => line.match(/^#{2,5}\s/)); // Match headings from H2 to H5

  return headingLines.map((line) => {
    const level = line.split(" ")[0].length;
    const text = line.replace(/^#{2,5}\s/, "").trim(); // Extract heading text

    // Generate a slugified ID using the slugger
    const id = slugger.slug(text);

    return { level, text, id };
  });
}
