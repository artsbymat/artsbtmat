import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function filename2slug(filename) {
  const baseName = filename.replace(/\.md$/, "");
  return baseName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

export function formattedDateMonthYear(date) {
  return date.toLocaleString("en-US", {
    month: "short",
    year: "numeric"
  });
}
