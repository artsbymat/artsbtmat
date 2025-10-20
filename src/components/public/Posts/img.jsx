"use client";

import Image from "next/image";
import { RenderExcalidraw } from "./RenderExcalidraw";

export const CustomImage = ({ src, alt = "" }) => {
  if (src.startsWith(`/content/Attachments/excalidraw`)) {
    return <RenderExcalidraw src={src} alt={alt} />;
  }

  const match = alt.match(/\|(\d+)\s*$/);
  const width = match ? parseInt(match[1], 10) : 600;
  const aspectRatio = 4 / 3;
  const height = Math.round(width / aspectRatio);

  const cleanAlt = alt.replace(/\s*\|\s*\d+\s*$/, "").trim();

  return (
    <div className="my-4 flex justify-center">
      <div
        style={{
          width: `${width}px`,
          height: "auto"
        }}
      >
        <Image
          src={src}
          alt={cleanAlt}
          width={width}
          height={height}
          style={{
            width: "100%",
            height: "auto",
            objectFit: "contain"
          }}
        />
      </div>
    </div>
  );
};
