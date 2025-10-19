import HeadingPage from "@/components/public/HeadingPage";
import { ProjectCard } from "@/components/public/ProjectCard";
import { Button } from "@/components/ui/button";
import { getAllStaticJSON } from "@/lib/public-static";
import Link from "next/link";

export default function WorkPage() {
  const { data } = getAllStaticJSON().find(({ slug }) => slug === "Projects");

  const title = "Work - Personal Projects & Experiments";
  const description =
    "A collection of personal projects and experiments that explore ideas through design, code, and writing. Each work reflects ongoing curiosity and practical exploration.";

  return (
    <div>
      <HeadingPage title={title} description={description} />

      <section className="mx-auto mb-4 max-w-7xl px-4 md:px-8">
        <div className="border-border flex items-center justify-between border-b py-4">
          <div className="">
            <h2 className="text-xl leading-snug font-medium">Projects</h2>
            <p className="text-sm font-light">
              A collection of certifications that reflect my commitment to continuous learning and
              professional growth in web development and related technologies.
            </p>
          </div>
          <Button asChild className="mt-4">
            <Link href="/posts/notes/mindmap/projects">View Mindmap</Link>
          </Button>
        </div>

        {data.length > 0 ? (
          <div className="divide-border divide-y">
            {data
              .slice()
              .reverse()
              .map((item) => {
                return <ProjectCard key={item.link} data={item} />;
              })}
          </div>
        ) : (
          <div className="py-4">
            <p className="text-accent text-base font-medium">Ooops... Certificates Not Found</p>
          </div>
        )}
      </section>
    </div>
  );
}
