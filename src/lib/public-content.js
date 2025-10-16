import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { extractTableOfContent, filename2slug } from "./utils";

const CONTENT_DIR = path.join(process.cwd(), "src/content");

/**
 * Recursively collects all Markdown (.md) files within a directory,
 * excluding paths listed in IGNORE_PATHS.
 *
 * @param {string} dir - The directory path to search inside.
 * @param {string[]} [ignoreList=[]] - Optional list of relative paths to ignore.
 * @returns {string[]} - An array of absolute file paths.
 */
function getAllMarkdownFiles(dir, ignoreList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(CONTENT_DIR, fullPath);

    // Skip ignored files/folders (exact match or subpath)
    if (ignoreList.some((ignored) => relativePath.startsWith(ignored))) {
      return [];
    }

    if (entry.isDirectory()) return getAllMarkdownFiles(fullPath, ignoreList);
    if (entry.isFile() && entry.name.endsWith(".md")) return [fullPath];
    return [];
  });
}

const IGNORE_PATHS = [
  "01. Daily Notes",
  "02. Reference Notes/Kanban",
  "02. Reference Notes/Excalidraw/Hooks",
  "02. Reference Notes/Excalidraw/Script",
  "02. Reference Notes/Excalidraw/Palletes",
  "05. Outputs/Video",
  "Templates",
  "Attachments"
];

/**
 * Defines custom path-to-slug mapping rules.
 *
 * Keys represent relative paths from the `src/content` directory.
 * Values define the desired slug prefix.
 *
 * Example:
 *   "01. Daily Notes" → "/posts/daily"
 *   "02. Reference Notes/Topics" → "/posts/topics"
 */
const SLUG_RULES = {
  "01. Daily Notes": "/posts/daily",
  "02. Reference Notes/Topics": "/posts/topics",
  "02. Reference Notes/Kanban": "/posts/kanban",
  "02. Reference Notes/Excalidraw": "/posts/excalidraw",
  "03. Permanent Notes": "/posts/permanent",
  "04. Hub Notes": "/posts/hub",
  "05. Outputs/Blog": "/posts/blog",
  "05. Outputs/Static": "/posts/static"
};

/**
 * Resolves a Markdown file path into a custom slug based on defined rules.
 *
 * Behavior:
 * - Matches the file path against `SLUG_RULES` (longest match wins).
 * - If no rule matches, falls back to `/posts/...`.
 * - Remaining path segments are sanitized using `filename2slug()`.
 *
 * @param {string} filePath - Absolute file path of the Markdown file.
 * @returns {string} - The generated slug (e.g. "/posts/topics/warp-terminal").
 */
export function resolveSlug(filePath) {
  const relative = path.relative(CONTENT_DIR, filePath);
  const withoutExt = relative.replace(/\.md$/, "");
  const parts = withoutExt.split(path.sep);

  // Find the most specific matching rule
  const matchedRule = Object.entries(SLUG_RULES)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([rulePath]) => relative.startsWith(rulePath));

  let baseSlug = "";
  let remainingParts = parts;

  if (matchedRule) {
    const [rulePath, prefix] = matchedRule;
    baseSlug = prefix;
    const matchedParts = rulePath.split(path.sep);
    remainingParts = parts.slice(matchedParts.length);
  } else {
    baseSlug = "/posts";
  }

  // Convert remaining segments into clean slugs
  const tailSlug = remainingParts.map(filename2slug).join("/");

  // Combine all segments
  let slug = `${baseSlug}/${tailSlug}`.replace(/\/+/g, "/");

  return slug;
}

/**
 * Retrieves all published posts within the `src/content` directory.
 *
 * A post is considered **published** only if its frontmatter includes:
 * ```yaml
 * publish: true
 * ```
 *
 * Each returned object includes:
 * - `slug`: URL slug (custom-resolved)
 * - `title`: extracted from frontmatter or file name
 * - `frontmatter`: the parsed metadata
 * - `content`: the raw Markdown content
 *
 * @returns {Array<{slug: string, title: string, frontmatter: object, content: string}>}
 */
export function getAllPosts() {
  const files = getAllMarkdownFiles(CONTENT_DIR, IGNORE_PATHS);

  return files
    .map((file) => {
      const raw = fs.readFileSync(file, "utf-8");
      const { data: frontmatter, content } = matter(raw);

      // Skip posts that are not explicitly published
      if (!frontmatter.publish) return null;

      const title =
        frontmatter.title || path.basename(file, path.extname(file)).replace(/\.[a-z]+$/, "");

      const slug = resolveSlug(file);

      return { slug, title, frontmatter, content, toc: extractTableOfContent(content) };
    })
    .filter(Boolean); // remove null entries
}

/**
 * Retrieves a single post by its slug.
 *
 * @param {string} slug - The slug (without extension).
 * @returns {{slug: string, title: string, frontmatter: object, content: string} | null}
 */
export function getPostBySlug(slug) {
  const fullPath = path.join(CONTENT_DIR, slug + ".md");
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data: frontmatter, content } = matter(raw);

  const title =
    frontmatter.title || path.basename(fullPath, path.extname(fullPath)).replace(/\.[a-z]+$/, "");

  return { slug, title, frontmatter, content };
}

/**
 * Utility function for Next.js `getStaticPaths`.
 *
 * @returns {string[]} - List of all post slugs.
 */
export function getAllSlugs() {
  return getAllPosts().map((p) => p.slug);
}

export function getAllBlogPosts() {
  return getAllPosts().filter((post) => post.slug.startsWith("/posts/blog"));
}

export function getAllNotesPosts() {
  return getAllPosts().filter(
    (post) =>
      post.slug.startsWith("/posts/topics") ||
      post.slug.startsWith("/posts/permanent") ||
      post.slug.startsWith("/posts/hub")
  );
}
