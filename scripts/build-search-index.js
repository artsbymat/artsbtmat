import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Document } from "flexsearch";
import { filename2slug, cleanMarkdown } from "../src/lib/utils.js";
import { IGNORE_PATHS, SLUG_RULES } from "../src/data/constants.js";

const CONTENT_DIR = "src/content";
const OUTPUT_FILE = "public/content/search-index.json";

/**
 * Recursively collects all Markdown (.md) files under a directory,
 * skipping any path that starts with entries in ignoreList.
 * @param {string} dir
 * @param {string[]} [ignoreList]
 * @returns {string[]} absolute file paths
 */
function getAllMarkdownFiles(dir, ignoreList = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(CONTENT_DIR, fullPath);

    if (ignoreList.some((ignored) => relativePath.startsWith(ignored))) return [];

    if (entry.isDirectory()) return getAllMarkdownFiles(fullPath, ignoreList);
    if (entry.isFile() && entry.name.endsWith(".md")) return [fullPath];
    return [];
  });
}

/**
 * Resolves a slug for a markdown file based on SLUG_RULES and its path.
 * @param {string} filePath absolute path to markdown file
 * @returns {string} slug starting with a leading slash
 */
export function resolveSlug(filePath) {
  const relative = path.relative(CONTENT_DIR, filePath);
  const withoutExt = relative.replace(/\.md$/, "");
  const parts = withoutExt.split(path.sep);

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

  const tailSlug = remainingParts.map(filename2slug).join("/");
  const slug = `${baseSlug}/${tailSlug}`.replace(/\/+/g, "/");

  return slug;
}

/**
 * Reads all posts, parses frontmatter, filters unpublished, and returns
 * a list of objects ready to be indexed by FlexSearch.
 * @returns {Array<{slug:string,title:string,content:string,tags:string}>}
 */
function getAllPosts() {
  const files = getAllMarkdownFiles(CONTENT_DIR, IGNORE_PATHS);

  const rawPosts = files
    .map((file) => {
      const raw = fs.readFileSync(file, "utf-8");
      const { data: frontmatter, content } = matter(raw);
      if (!frontmatter.publish) return null;

      const title = cleanMarkdown(
        frontmatter.title || path.basename(file, path.extname(file))
      );
      const slug = resolveSlug(file);
      const tags = cleanMarkdown(
        Array.isArray(frontmatter.tags) ? frontmatter.tags.join(" ") : ""
      );
      const contentClean = cleanMarkdown(content);

      return { slug, title, content: contentClean, tags };
    })
    .filter(Boolean);

  return rawPosts;
}

async function buildSearchIndex() {
  console.log("🔍 Building FlexSearch index...");

  const posts = getAllPosts();
  console.log(`📄 Found ${posts.length} published posts`);

  const index = new Document({
    document: {
      id: "slug",
      index: ["title", "content", "tags"],
      store: ["title", "slug", "content", "tags"]
    },
    tokenize: "forward",
    cache: true
  });

  for (const post of posts) {
    index.add(post);
  }

  const exported = {};
  index.export((key, data) => {
    exported[key] = data;
  });

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(exported));

  console.log(`✅ Search index written to ${OUTPUT_FILE}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildSearchIndex().catch((err) => {
    console.error("❌ Failed to build search index:", err);
    process.exit(1);
  });
}
