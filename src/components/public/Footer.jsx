import { UI } from "@/data/constants";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t-border mx-auto w-full border-t-1">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <ul className="text-foreground flex gap-x-4 text-sm font-light md:gap-x-8 md:text-base">
          {UI.FOOTER_LINKS.map((item) => {
            return (
              <li key={item.href}>
                <Link href={item.href}>{item.title}</Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </footer>
  );
}
