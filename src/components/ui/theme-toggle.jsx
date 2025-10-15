"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = resolvedTheme || theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="p-2 transition-transform duration-200"
      type="button"
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Sun className="size-4 md:size-5" />
      ) : (
        <Moon className="size-4 md:size-5" />
      )}
    </button>
  );
}
