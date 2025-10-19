import Image from "next/image";
import Link from "next/link";

export function CertificateCard({ data }) {
  return (
    <article className="py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        {/* Thumbnail */}
        <div className="relative aspect-[16/9] w-full md:w-[400px]">
          <Link href={data.link}>
            <Image
              src={data.image}
              alt={`thumbnail ${data.title}`}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-contain object-center"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center md:flex-1">
          <Link href={data.link}>
            <h3 className="text-md leading-snug font-medium">{data.title}</h3>
          </Link>

          <p className="text-foreground/80 mt-3 text-base">{data.description}</p>
        </div>
      </div>
    </article>
  );
}
