"use client";

import { Check, Clipboard } from "lucide-react";
import { useRef, useState } from "react";

export function CustomPre({ children, ...props }) {
  const [isCopied, setIsCopied] = useState(false);
  const preRef = useRef(null);

  const handleClickCopy = async () => {
    const code = preRef.current?.textContent;

    if (code) {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <div className="group relative">
      <button
        disabled={isCopied}
        onClick={handleClickCopy}
        aria-label="Copy code"
        className="absolute top-2 right-2 z-10 opacity-100 transition-opacity duration-200 group-hover:opacity-100 md:opacity-0"
      >
        {isCopied ? (
          <Check size={20} className="bg-background border-border border-1" />
        ) : (
          <Clipboard size={20} className="bg-background border-border border-1" />
        )}
      </button>

      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  );
}
