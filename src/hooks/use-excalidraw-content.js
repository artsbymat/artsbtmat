"use client";

import { SLUG_RULES } from "@/data/constants";
import { useEffect, useState } from "react";

function mapInternalLink(href) {
  const cleanHref = href.replace(/&amp;/g, "&");

  const match = cleanHref.match(/&file=([^&]+)/);
  if (!match) return href;

  let filePath = decodeURIComponent(match[1]).replace(/\\/g, "/").replace(/\+/g, " ").trim();

  const matchedKey = Object.keys(SLUG_RULES).find((key) => filePath.startsWith(key));
  if (!matchedKey) return href;

  let rest = filePath.slice(matchedKey.length).replace(/^\/+/, "");

  const slug = rest
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${SLUG_RULES[matchedKey]}/${slug}`;
}

export function useExcalidrawContent(src) {
  const [svgContent, setSvgContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) return;

    let isActive = true;
    setIsLoading(true);
    setError(null);

    fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((text) => {
        if (!isActive) return;

        let transformed = text
          .replace(/href=(['"])obsidian:\/\/open\?vault=[^'"]*?\1/g, (match, quote) => {
            const href = match.match(/(['"])(.*?)\1/)?.[2];
            const newHref = mapInternalLink(href);
            return `href=${quote}${newHref}${quote}`;
          })
          .replace(/src=(['"])obsidian:\/\/open\?vault=[^'"]*?\1/g, (match, quote) => {
            const src = match.match(/(['"])(.*?)\1/)?.[2];
            const newSrc = mapInternalLink(src);
            return `src=${quote}${newSrc}${quote}`;
          });

        setSvgContent(transformed);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading SVG:", err);
        if (isActive) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [src]);

  return { svgContent, isLoading, error };
}
