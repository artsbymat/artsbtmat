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
 * Formats a given date into a short, human-readable string such as "Wed, 20 Aug 2025".
 *
 * This function extracts the weekday, day, month, and year components separately
 * to ensure consistent ordering across locales, since `toLocaleString()` may vary
 * in output format depending on the user's system settings.
 *
 * @function formattedDateDayMonthYear
 * @param {Date} date - The date object to format.
 * @returns {string} A formatted date string in the format "Wed, 20 Aug 2025".
 *
 * @example
 * formattedDateDayMonthYear(new Date("2025-08-20"));
 * // Returns: "Wed, 20 Aug 2025"
 */
export function formattedDateDayMonthYear(date) {
  const weekday = date.toLocaleString("en-US", { weekday: "short" });
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  return `${weekday}, ${day} ${month} ${year}`;
}

/**
 * Formats a given date and time into a short, human-readable string
 * such as "Thu, 23 Oct 2025, 10:10".
 *
 * This function extracts the weekday, day, month, year, and time components
 * separately to maintain a consistent format across different locales,
 * avoiding variations caused by `toLocaleString()` defaults.
 *
 * The time is represented in 24-hour format with zero-padded hours and minutes.
 *
 * @function formattedDateTime
 * @param {Date} date - The date object to format.
 * @returns {string} A formatted string in the format "Thu, 23 Oct 2025, 10:10".
 *
 * @example
 * formattedDateTime(new Date("2025-10-23T10:10:00"));
 * // Returns: "Thu, 23 Oct 2025, 10:10"
 */
export function formattedDateTime(date) {
  const weekday = date.toLocaleString("en-US", { weekday: "short" });
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${weekday}, ${day} ${month} ${year}, ${hours}:${minutes}`;
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

/**
 * Normalizes a tag by replacing all forward slashes ("/") with hyphens ("-").
 *
 * This function is useful when tags are used in contexts such as URLs, slugs,
 * or filenames where the "/" character can cause path conflicts or ambiguity.
 *
 * @param {string} rawTag - The original tag that may contain "/" characters.
 * @returns {string} - A normalized version of the tag with all "/" replaced by "-".
 *
 * @example
 * normalizeTag("web/dev");
 * // Returns: "web-dev"
 *
 * @example
 * normalizeTag("ai/machine/learning");
 * // Returns: "ai-machine-learning"
 */
export function normalizeTag(rawTag) {
  return rawTag.replace(/\//g, "-");
}

/**
 * Strips common Markdown formatting into readable plain text.
 *
 * - Removes fenced code fences and their language labels (keeps inner code)
 * - Drops headings, emphasis, inline code markers, links/images syntax
 * - Unquotes blockquotes and collapses whitespace
 *
 * @param {string} [str=""] Raw markdown string
 * @returns {string} Plain text without markdown artifacts
 */
export function cleanMarkdown(str = "") {
  return String(str)
    .replace(/```[^\n]*\n([\s\S]*?)```/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/-{3,}/g, "")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .replace(/[*_~`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Escapes HTML special characters after cleaning markdown.
 * Useful when injecting text via dangerouslySetInnerHTML.
 *
 * @param {string} [str=""] Raw markdown or text content
 * @returns {string} Safe HTML-escaped, markdown-free string
 */
export function escapeHtml(str = "") {
  const clean = cleanMarkdown(str);
  return String(clean)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
