import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names intelligently using both `clsx` and `tailwind-merge`.
 *
 * This utility ensures that conditional class names are handled cleanly (`clsx`)
 * and that conflicting Tailwind classes are deduplicated (`twMerge`).
 *
 * Example:
 * ```js
 * cn("p-2", "bg-red-500", isActive && "bg-green-500");
 * // → "p-2 bg-green-500"
 * ```
 *
 * @param {...(string|false|null|undefined|Record<string, boolean>)} inputs - A list of class names or conditionals.
 * @returns {string} A merged string of class names.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a Markdown filename into a clean, URL-safe slug.
 *
 * It removes the `.md` extension, normalizes accents, and replaces invalid
 * characters and spaces with hyphens. Useful for mapping markdown files to routes.
 *
 * Example:
 * ```js
 * filename2slug("Café au lait.md");
 * // → "cafe-au-lait"
 * ```
 *
 * @param {string} filename - The original markdown filename (e.g., "My Note.md").
 * @returns {string} A normalized, URL-friendly slug.
 */
export function filename2slug(filename) {
  const baseName = filename.replace(/\.md$/, "");
  return baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, " ") // remove non-alphanumeric
    .replace(/\s+/g, "-") // replace spaces with dashes
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}

/**
 * Converts a heading string (e.g., from markdown) into an HTML ID-friendly string.
 *
 * This is typically used to generate anchors for headings in markdown-rendered content.
 * It removes diacritics, non-alphanumeric characters, and converts spaces to hyphens.
 *
 * Example:
 * ```js
 * heading2id("Understanding the Zettelkasten Method!");
 * // → "understanding-the-zettelkasten-method"
 * ```
 *
 * @param {string} text - The heading text.
 * @returns {string} A normalized ID string suitable for HTML anchors.
 */
export function heading2id(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Extracts a table of contents (ToC) from markdown content.
 *
 * It parses all heading lines (`#`, `##`, ..., `######`) while ignoring headings
 * inside fenced code blocks (``` or ~~~). Each heading entry includes its level,
 * text, and generated ID (via {@link heading2id}).
 *
 * Example:
 * ```js
 * extractTableOfContent("# Title\\n## Section\\n### Subsection");
 * // → [
 * //     { level: 1, text: "Title", id: "title" },
 * //     { level: 2, text: "Section", id: "section" },
 * //     { level: 3, text: "Subsection", id: "subsection" }
 * //   ]
 * ```
 *
 * @param {string} content - The raw markdown content.
 * @returns {Array<{ level: number, text: string, id: string }>} List of extracted headings for ToC.
 */
export function extractTableOfContent(content) {
  const lines = content.split("\n");
  const toc = [];
  const headingRegex = /^(#{1,6})\s+(.*)$/;
  let inFencedCodeBlock = false;

  for (const line of lines) {
    if (/^```|^~~~/.test(line.trim())) {
      inFencedCodeBlock = !inFencedCodeBlock;
      continue;
    }
    if (inFencedCodeBlock) continue;

    const match = line.match(headingRegex);
    if (match) {
      const text = match[2].trim();
      toc.push({
        level: match[1].length,
        text,
        id: heading2id(text)
      });
    }
  }
  return toc;
}

/**
 * Formats a JavaScript `Date` object into a short "Month Year" string.
 *
 * Example:
 * ```js
 * formattedDateMonthYear(new Date("2023-06-15"));
 * // → "Jun 2023"
 * ```
 *
 * @param {Date} date - The date to format.
 * @returns {string} Formatted string in "MMM YYYY" format (English locale).
 */
export function formattedDateMonthYear(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric"
  });
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
