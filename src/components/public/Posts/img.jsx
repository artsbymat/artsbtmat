import Image from "next/image";
import { RenderExcalidraw } from "./RenderExcalidraw";

export const CustomImage = ({ src, alt = "" }) => {
  if (src.startsWith(`/content/Attachments/excalidraw`)) {
    return <RenderExcalidraw src={src} alt={alt} />;
  } else {
    return (
      <div>
        <Image src={src} width={1000} height={750} alt={alt} />
      </div>
    );
  }
};
