"use client";

import { useEffect } from "react";

export default function HeadingHighlight() {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.getElementById(hash.substring(1));
      if (el) {
        el.classList.add("highlighted");

        setTimeout(() => {
          el.classList.remove("highlighted");
        }, 1500);
      }
    }
  }, []);

  return null;
}
