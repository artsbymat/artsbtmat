import { MarkdownAsync } from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import "rehype-callouts/theme/obsidian";
import rehypeCallouts from "rehype-callouts";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import { arabicIcon, latinIcon, translateIcon } from "@/components/ui/icons";
import rehypeShiftHeading from "rehype-shift-heading";
import rehypeSlug from "@/lib/rehype/rehype-slug";
import { CustomPre } from "./pre";
import "@/styles/markdown-content.css";
import obsidianHighlight from "@/lib/remark/obsidian-highlight";
import remarkTagLinks from "@/lib/remark/obsidian-tag-link";

export function RenderMarkdown({ detail }) {
  const remarkPlugins = [remarkGfm, remarkMath, obsidianHighlight, remarkTagLinks];
  const rehypePlugins = [
    [rehypeSlug],
    [rehypeAutolinkHeadings, { behavior: "append" }],
    [rehypeShiftHeading, { shift: 1 }],
    [
      rehypePrettyCode,
      {
        theme: { dark: "gruvbox-dark-soft", light: "gruvbox-light-soft" },
        defaultLang: "plaintext"
      }
    ],
    [rehypeKatex],
    [
      rehypeCallouts,
      {
        theme: "obsidian",
        callouts: {
          arabic: { title: "Arabic", indicator: arabicIcon },
          latin: { title: "Latin", indicator: latinIcon },
          translation: { title: "Translation", indicator: translateIcon }
        }
      }
    ],
    [rehypeExternalLinks, { rel: ["nofollow"] }],
    [rehypeRaw]
  ];

  return (
    <MarkdownAsync
      components={{
        pre: (props) => <CustomPre {...props} />
      }}
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
    >
      {detail.content}
    </MarkdownAsync>
  );
}
