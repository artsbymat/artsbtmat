/**
 * @typedef {import('hast').Root} Root
 */

/**
 * @typedef Options
 *   Configuration (optional).
 * @property {string} [prefix='']
 *   Prefix to add in front of `id`s (default: `''`).
 */

/** @type {Options} */
const emptyOptions = {};

import { headingRank } from "hast-util-heading-rank";
import { toString } from "hast-util-to-string";
import { visit } from "unist-util-visit";

/**
 * Convert text into a slug-friendly string
 * @param {string} value
 * @returns {string}
 */
function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-") // replace non letters/numbers with "-"
    .replace(/^-+|-+$/g, ""); // trim "-"
}

/**
 * Add `id`s to headings.
 *
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns
 *   Transform.
 */
export default function rehypeSlug(options) {
  const settings = options || emptyOptions;
  const prefix = settings.prefix || "";

  return function (tree) {
    const used = new Map(); // track duplicate slugs

    visit(tree, "element", function (node) {
      if (headingRank(node) && !node.properties.id) {
        let base = slugify(toString(node)) || "section";
        let slug = prefix + base;

        // check duplicates
        if (used.has(slug)) {
          let count = used.get(slug) + 1;
          used.set(slug, count);
          slug = `${slug}-${count}`;
        } else {
          used.set(slug, 0);
        }

        node.properties.id = slug;
      }
    });
  };
}
