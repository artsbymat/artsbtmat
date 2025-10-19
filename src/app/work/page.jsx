import HeadingPage from "@/components/public/HeadingPage";
import { RenderMarkdown } from "@/components/public/Posts/RenderMarkdown";
import { getAllStaticPosts } from "@/lib/public-content";

export default function WorkPage() {
  const data = getAllStaticPosts().find((post) => post.slug === "/posts/static/work");

  const title = "Work – Personal Projects & Experiments";
  const description =
    "A collection of personal projects and experiments that explore ideas through design, code, and writing. Each work reflects ongoing curiosity and practical exploration.";

  return (
    <div>
      <HeadingPage title={title} description={description} />
      <div id="markdown-content">
        <RenderMarkdown detail={data} />
      </div>
    </div>
  );
}
