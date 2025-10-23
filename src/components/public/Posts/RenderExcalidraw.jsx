"use client";

import { Spinner } from "@/components/ui/spinner";
import { useExcalidrawContent } from "@/hooks/use-excalidraw-content";
import { SVGZoomPan } from "@/lib/svg-zoom-pan";
import { useEffect, useRef } from "react";
import "@/styles/excalidraw.css";

export function RenderExcalidraw({ src, alt }) {
  const containerRef = useRef(null);
  const { svgContent, isLoading, error } = useExcalidrawContent(src);

  // Apply interactivity after SVG inserted
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;
    const cleanup = SVGZoomPan(containerRef.current);
    return cleanup;
  }, [svgContent]);

  if (isLoading) {
    return (
      <div className="mt-8 flex justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return <p className="text-center">Opps, Failed to load SVG</p>;
  }

  return (
    <>
      <div
        ref={containerRef}
        role="img"
        aria-label={alt}
        className="excalidraw-svg"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <p className="hidden text-sm! text-yellow-700 md:mt-1! md:block">
        Drag to pan. SHIFT + wheel or pinch to zoom. Double-click to zoom. ESC to reset.
      </p>
    </>
  );
}
