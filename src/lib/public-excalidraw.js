import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Collects all published Excalidraw markdown notes from the content directory,
 * and returns their corresponding `.svg` paths for published entries.
 *
 * Each `.md` file in `src/content/02. Reference Notes/Excalidraw/`
 * is parsed for frontmatter. If `publish: true`, an object is returned
 * containing a `slug`, a human-readable `title`, and a public-facing `.svg` path.
 *
 * Example output:
 * ```js
 * [
 *   {
 *     slug: "fitur-di-obsidian-excalidraw-light",
 *     title: "Fitur Di Obsidian Excalidraw",
 *     path: "/content/Excalidraw/Fitur di Obsidian Excalidraw.light.svg"
 *   }
 * ]
 * ```
 *
 * @returns {Array<{ slug: string, title: string, path: string }>} List of published Excalidraw diagrams
 */
export function getAllExcalidrawPosts() {
  const baseDir = path.join(process.cwd(), "src/content/02. Reference Notes/Excalidraw");

  /**
   * Recursively reads `.md` files and collects only those with `publish: true`.
   * @param {string} dir - Directory path to scan.
   * @returns {Array<{ slug: string, title: string, path: string }>}
   */
  function readDirRecursively(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    return entries.flatMap((entry) => {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return readDirRecursively(fullPath);
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        const fileContent = fs.readFileSync(fullPath, "utf-8");
        const { data: frontmatter } = matter(fileContent);

        if (frontmatter.publish === true) {
          const baseName = path.basename(entry.name, ".md");
          const slug = sanitizeFilename(baseName);
          const title = formatMindmapTitle(formatTitle(baseName));

          // Replace `.md` with `.svg` for the web path
          const relativePath = path
            .relative(baseDir, fullPath)
            .replace(/\\/g, "/") // ensure cross-platform
            .replace(/\.md$/, ".svg");

          const webPath = `/content/Excalidraw/${relativePath}`;

          return [{ slug, title, path: webPath }];
        }
      }

      return [];
    });
  }

  return readDirRecursively(baseDir);
}

/**
 * Sanitizes a filename by normalizing spacing, punctuation, and casing.
 *
 * @param {string} name - The filename (without extension)
 * @returns {string} Sanitized slug
 */
function sanitizeFilename(name) {
  return name
    .replace(/\s*-\s*/g, "-")
    .replace(/[,.\s]+$/g, "")
    .replace(/[,\s]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

/**
 * Converts a filename into a readable title.
 * Example: "fitur-di-obsidian-excalidraw-light" → "Fitur Di Obsidian Excalidraw Light"
 *
 * @param {string} name - The original filename (without extension)
 * @returns {string} Human-readable title
 */
function formatTitle(name) {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Removes any substring that appears after the first dot ('.') in the title.
 * Example: "Fitur Di Obsidian Excalidraw.Light" → "Fitur Di Obsidian Excalidraw"
 *
 * @param {string} string - Input string
 * @returns {string} Trimmed title
 */
export function formatMindmapTitle(string) {
  return string.replace(/\..*$/, "");
}
