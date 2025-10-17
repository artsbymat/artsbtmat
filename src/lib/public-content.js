import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { extractTableOfContent, filename2slug, heading2id } from "./utils";
import { cache } from "react";

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
  "02. Reference Notes/Excalidraw",
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
  "02. Reference Notes/Topics": "/posts/notes/topics",
  "02. Reference Notes/Excalidraw": "/posts/notes/excalidraw",
  "03. Permanent Notes": "/posts/notes/permanent",
  "04. Hub Notes": "/posts/notes/hub",
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
 * Build a slug index that includes heading anchors for intra-document linking.
 * @param {Array<{slug: string, title: string, toc: Array<{text: string, id: string}>}>} posts
 */
function buildSlugIndex(posts) {
  const index = {};
  for (const post of posts) {
    const baseName = filename2slug(post.title || "");
    index[baseName] = {
      slug: post.slug,
      headings: new Map(post.toc.map((h) => [heading2id(h.text), h.id]))
    };
  }
  return index;
}

/**
 * Convert Obsidian-style wikilinks to Markdown syntax, skipping code regions.
 *
 * @param {string} content
 * @param {Record<string, {slug: string, headings: Map<string,string>}>} slugIndex
 * @returns {string}
 */
function convertWikiLinks(content, slugIndex) {
  // --- 1️⃣ Lindungi fenced code blocks dan inline code -------------------
  const codeBlocks = [];
  content = content.replace(/(```[\s\S]*?```|~~~[\s\S]*?~~~|`[^`]*`)/g, (m) => {
    codeBlocks.push(m);
    return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
  });

  // --- 2️⃣ Proses bagian non-kode ---------------------------------------

  // Image wikilinks: ![[filename|size]]
  content = content.replace(/!\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g, (match, filename, size) => {
    const cleanName = path.basename(filename.trim());
    const encodedPath = encodeURIComponent(cleanName);
    const altText = size ? `${cleanName} (${size})` : cleanName;
    return `![${altText}](/content/Attachments/${encodedPath})`;
  });

  // Text wikilinks: [[target|label]] or [[target#heading|label]]
  content = content.replace(/\[\[([^|\]]+)(?:\|([^\]]+))?\]\]/g, (match, target, label) => {
    // Pisahkan nama file dan heading
    const [filePart, headingPart] = target.split("#");

    const key = filename2slug(path.basename(filePart.trim()));
    const slugInfo = slugIndex[key];
    if (!slugInfo) return label || target;

    let link = slugInfo.slug;

    // Jika ada heading reference → tambahkan anchor
    if (headingPart) {
      const anchor = heading2id(headingPart.trim());
      link += `#${anchor}`;
    }

    // Jika label dimulai dengan '#' → anggap teks literal, bukan heading
    const safeLabel = label?.startsWith("#") ? label : label || target;

    return `[${safeLabel}](${link})`;
  });

  // --- 3️⃣ Kembalikan code blocks ---------------------------------------
  content = content.replace(/%%CODEBLOCK_(\d+)%%/g, (_, i) => codeBlocks[i]);

  return content;
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
export const getAllPosts = cache(() => {
  const files = getAllMarkdownFiles(CONTENT_DIR, IGNORE_PATHS);

  const rawPosts = files
    .map((file) => {
      const raw = fs.readFileSync(file, "utf-8");
      const { data: frontmatter, content } = matter(raw);

      if (!frontmatter.publish) return null;

      const title = frontmatter.title || path.basename(file, path.extname(file));
      const slug = resolveSlug(file);
      const toc = extractTableOfContent(content);

      return { slug, title, frontmatter, content, toc };
    })
    .filter(Boolean);

  const slugIndex = buildSlugIndex(rawPosts);

  // Convert wikilinks after ToC is known
  return rawPosts.map((post) => ({
    ...post,
    content: convertWikiLinks(post.content, slugIndex)
  }));
});

/**
 * Retrieves a single post by its slug
 * using the cached result from `getAllPosts()`.
 *
 * @param {string} slug - The slug (without extension).
 * @returns {{slug: string, title: string, frontmatter: object, content: string} | null}
 */
export function getPostBySlug(slug) {
  const allPosts = getAllPosts();
  const post = allPosts.find((p) => p.slug === slug);
  return post || null;
}

/**
 * Collects and normalizes all post slugs for Next.js `generateStaticParams`.
 *
 * Supports routes:
 * - `/posts/blog/[slug]`
 * - `/posts/notes/[type]/[slug]`
 * - `/notes/[type]`
 *
 * Example output:
 * ```js
 * {
 *   blog: [
 *     { slug: "why-writing-matters" }
 *   ],
 *   notes: [
 *     { type: "topics", slug: "learning-theory" },
 *     { type: "hub", slug: "knowledge-management" },
 *     { type: "permanent", slug: "zettelkasten-method" }
 *   ],
 *   notesType: [
 *     { type: "topics" },
 *     { type: "hub" },
 *     { type: "permanent" }
 *   ]
 * }
 * ```
 *
 * @returns {{
 *   blog: { slug: string }[],
 *   notes: { type: string, slug: string }[],
 *   notesType: { type: string }[]
 * }} Object containing route params for all static routes.
 */
export const getAllSlugs = cache(() => {
  const posts = getAllPosts();

  const blog = [];
  const notes = [];
  const noteTypes = new Set(); // to avoid duplicates for /notes/[type]

  for (const post of posts) {
    const parts = post.slug.split("/").filter(Boolean);

    // Examples:
    // /posts/blog/why-writing-matters → ["posts", "blog", "why-writing-matters"]
    // /posts/notes/topics/learning-theory → ["posts", "notes", "topics", "learning-theory"]

    if (parts[1] === "blog") {
      blog.push({ slug: parts[2] });
    } else if (parts[1] === "notes") {
      const type = parts[2];
      const slug = parts[3];
      if (["topics", "hub", "permanent"].includes(type)) {
        notes.push({ type, slug });
        noteTypes.add(type);
      }
    }
  }

  return {
    blog,
    notes,
    notesType: Array.from(noteTypes).map((type) => ({ type }))
  };
});

/**
 * Returns all posts categorized under "Topics" notes.
 *
 * It filters all posts whose slug starts with `/posts/notes/topics`.
 *
 * Example:
 * ```js
 * [
 *   { slug: "/posts/notes/topics/learning-theory", title: "Learning Theory" },
 *   { slug: "/posts/notes/topics/system-thinking", title: "System Thinking" }
 * ]
 * ```
 *
 * @returns {Array<Object>} Array of topic note posts.
 */
export function getAllTopicsPosts() {
  return getAllPosts().filter((post) => post.slug.startsWith("/posts/notes/topics"));
}

/**
 * Returns all posts categorized under "Hub" notes.
 *
 * It filters all posts whose slug starts with `/posts/notes/hub`.
 *
 * Example:
 * ```js
 * [
 *   { slug: "/posts/notes/hub/knowledge-management", title: "Knowledge Management" }
 * ]
 * ```
 *
 * @returns {Array<Object>} Array of hub note posts.
 */
export function getAllHubPosts() {
  return getAllPosts().filter((post) => post.slug.startsWith("/posts/notes/hub"));
}

/**
 * Returns all posts categorized under "Permanent" notes.
 *
 * It filters all posts whose slug starts with `/posts/notes/permanent`.
 *
 * Example:
 * ```js
 * [
 *   { slug: "/posts/notes/permanent/zettelkasten-method", title: "Zettelkasten Method" }
 * ]
 * ```
 *
 * @returns {Array<Object>} Array of permanent note posts.
 */
export function getAllPermanentPosts() {
  return getAllPosts().filter((post) => post.slug.startsWith("/posts/notes/permanent"));
}

/**
 * Returns all posts categorized under "Excalidraw" notes.
 *
 * It filters all posts whose slug starts with `/posts/notes/excalidraw`.
 * Usually used for visual notes or mind maps created with Excalidraw.
 *
 * Example:
 * ```js
 * [
 *   { slug: "/posts/notes/excalidraw/mindmap-example", title: "Mindmap Example" }
 * ]
 * ```
 *
 * @returns {Array<Object>} Array of Excalidraw note posts.
 */
export function getAllExcalidrawPosts() {
  return getAllPosts().filter((post) => post.slug.startsWith("/posts/notes/excalidraw"));
}

/**
 * Returns all posts categorized under "Blog".
 *
 * It filters all posts whose slug starts with `/posts/blog`.
 *
 * Example:
 * ```js
 * [
 *   { slug: "/posts/blog/why-writing-matters", title: "Why Writing Matters" }
 * ]
 * ```
 *
 * @returns {Array<Object>} Array of blog posts.
 */
export function getAllBlogPosts() {
  return getAllPosts().filter((post) => post.slug.startsWith("/posts/blog"));
}

/**
 * Returns all "Notes" posts — including topics, hub, and permanent notes.
 *
 * It combines multiple note categories for general listing pages or indexing.
 *
 * Example:
 * ```js
 * [
 *   { slug: "/posts/notes/topics/learning-theory", title: "Learning Theory" },
 *   { slug: "/posts/notes/hub/knowledge-management", title: "Knowledge Management" },
 *   { slug: "/posts/notes/permanent/zettelkasten-method", title: "Zettelkasten Method" }
 * ]
 * ```
 *
 * @returns {Array<Object>} Array of all non-Excalidraw note posts.
 */
export function getAllNotesPosts() {
  return getAllPosts().filter(
    (post) =>
      post.slug.startsWith("/posts/notes/topics") ||
      post.slug.startsWith("/posts/notes/permanent") ||
      post.slug.startsWith("/posts/notes/hub")
  );
}
