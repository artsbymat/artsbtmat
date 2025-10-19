import localFont from "next/font/local";
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
import obsidianHighlight from "@/lib/remark/obsidian-highlight";
import remarkTagLinks from "@/lib/remark/obsidian-tag-link";
import { CustomPre } from "./pre";
import { CustomImage } from "./img";
import { CustomP } from "./p";
import "@/styles/markdown-content.css";

const arabicFont = localFont({
  src: "../../../assets/fonts/LPMQ-Isep-Misbah.woff2",
  variable: "--font-arabic"
});

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

  const cssClasses = detail.frontmatter.cssclasses?.join(" ") || [];

  return (
    <div id="markdown-content" className={`${cssClasses} ${arabicFont.variable}`}>
      <MarkdownAsync
        components={{
          pre: (props) => <CustomPre {...props} />,
          p: CustomP,
          img: CustomImage
        }}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
      >
        {detail.content}
      </MarkdownAsync>
    </div>
  );
}
