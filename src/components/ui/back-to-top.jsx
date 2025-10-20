"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "./button";

export function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show) return null;

  return (
    <Button
      size="icon"
      className="fixed right-4 bottom-8 z-50"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      <ChevronUp />
    </Button>
  );
}
