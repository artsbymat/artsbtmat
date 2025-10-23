import Image from "next/image";

export function ThumbnailBlog({ image = "" }) {
  return (
    <div className="relative mx-auto my-4 aspect-[1.91/1] max-w-2xl overflow-hidden">
      <Image
        src={image}
        alt="thumbnail blog"
        fill
        className="object-contain p-4"
        sizes="(max-width: 768px) 100vw, 1200px"
        priority
      />
    </div>
  );
}
