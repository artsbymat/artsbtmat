import { getAllStaticPosts } from "@/lib/public-content";
import { RenderMarkdown } from "./Posts/RenderMarkdown";

export function CertificateSection() {
  const data = getAllStaticPosts().find((post) => post.slug === "/posts/static/certificate");

  return (
    <section className="mx-auto my-4 max-w-7xl px-4 md:px-8">
      <div>
        <h2 className="text-xl leading-snug font-medium">Certificate</h2>
        <p className="text-sm font-light">
          There are many variations of passages of Lorem Ipsum available, but the majority have
          suffered alteration in some form
        </p>
      </div>
      <div id="markdown-content">
        <RenderMarkdown detail={data} />
      </div>
    </section>
  );
}
