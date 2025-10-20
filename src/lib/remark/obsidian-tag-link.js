import { visit } from "unist-util-visit";
import { normalizeTag } from "../utils";

/**
 * @fileoverview
 * Remark plugin that transforms hashtags (`#tag`) into Markdown links `[tag](/tags/tag)`.
 *
 * Features:
 * - Converts `#tag` → `[tag](/tags/tag)`
 * - Converts `#reference/youtube` → `[reference-youtube](/tags/reference-youtube)`
 * - Handles Unicode characters in tags (e.g., `#café`, `#日本語`)
 * - Works only inside paragraphs (skips code blocks, inline code, and headings)
 *
 * Example:
 * ```markdown
 * This is a #note and #reference/youtube and #日本語.
 *
 * # Heading with #ignore
 *
 * `#notconverted`
 *
 * \`\`\`
 * #notconverted
 * \`\`\`
 * ```
 *
 * Output:
 * ```html
 * <p>
 * This is a
 * <a href="/tags/note">note</a> and
 * <a href="/tags/reference-youtube">reference-youtube</a> and
 * <a href="/tags/日本語">日本語</a>.
 * </p>
 * <h1>Heading with #ignore</h1>
 * <p><code>#notconverted</code></p>
 * <pre><code>#notconverted</code></pre>
 * ```
 *
 * @module remarkTagLinks
 */

/**
 * Create a Remark plugin that replaces hashtags (`#tag`) with Markdown link nodes
 * linking to `/tags/{tag}`, respecting paragraph and code contexts.
 *
 * @returns {import('unified').Transformer} A Remark transformer function.
 */
export default function remarkTagLinks() {
  return (tree) => {
    visit(tree, "paragraph", (paragraphNode) => {
      const newChildren = [];

      for (const node of paragraphNode.children) {
        // Only process plain text nodes; skip inlineCode, links, etc.
        if (node.type !== "text") {
          newChildren.push(node);
          continue;
        }

        // Regex:
        // - allows Unicode (\p{L}), digits (\p{N}), underscore, hyphen, slash
        // - matches hashtags preceded by start of line or whitespace
        const regex = /(^|\s)#([\p{L}\p{N}_/-]+)/gu;

        let lastIndex = 0;
        const parts = [];
        let match;

        while ((match = regex.exec(node.value)) !== null) {
          const [fullMatch, prefix, rawTag] = match;

          // Add text before match
          if (match.index > lastIndex) {
            parts.push({
              type: "text",
              value: node.value.slice(lastIndex, match.index)
            });
          }

          // Preserve prefix (like whitespace)
          if (prefix) {
            parts.push({
              type: "text",
              value: prefix
            });
          }

          // Normalize: replace `/` with `-`
          const normalized = normalizeTag(rawTag);

          // Create a link node
          parts.push({
            type: "link",
            url: `/tags/${normalized.toLowerCase()}`,
            children: [
              {
                type: "text",
                value: `#${normalized}`
              }
            ]
          });

          lastIndex = match.index + fullMatch.length;
        }

        // Remaining text after last match
        if (lastIndex < node.value.length) {
          parts.push({
            type: "text",
            value: node.value.slice(lastIndex)
          });
        }

        // If no matches, keep original node
        if (parts.length === 0) parts.push(node);

        newChildren.push(...parts);
      }

      paragraphNode.children = newChildren;
    });
  };
}
