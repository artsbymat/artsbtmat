import { getAllStaticJSON } from "@/lib/public-static";
import { Button } from "../ui/button";
import Link from "next/link";
import { CertificateCard } from "./CertificateCard";

export function CertificateSection() {
  const { data } = getAllStaticJSON().find(({ slug }) => slug === "Certificates");

  return (
    <section className="mx-auto mb-4 max-w-7xl px-4 md:px-8">
      <div className="border-border flex flex-col items-start border-b py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl leading-snug font-medium">Certificates</h2>
          <p className="text-sm font-light">
            A collection of certifications that reflect my commitment to continuous learning and
            professional growth in web development and related technologies.
          </p>
        </div>
        <Button asChild className="mt-4">
          <Link href="/posts/notes/mindmap/certificates">View Mindmap</Link>
        </Button>
      </div>

      {data.length > 0 ? (
        <div className="divide-border divide-y">
          {data
            .slice()
            .reverse()
            .map((item) => {
              return <CertificateCard key={item.link} data={item} />;
            })}
        </div>
      ) : (
        <div className="py-4">
          <p className="text-accent text-base font-medium">Ooops... Certificates Not Found</p>
        </div>
      )}
    </section>
  );
}
