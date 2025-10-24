"use client";

import { UI } from "@/data/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchDialog } from "./SearchDialog";

export function Navigation() {
  const pathname = usePathname();
  return (
    <header className="border-b-border mx-auto w-full border-b-1">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <ul className="flex items-center gap-x-4 text-sm md:gap-x-8 md:text-base">
          <li>
            <SearchDialog />
          </li>
          {UI.NAVIGATION_LINKS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href} className={`${isActive ? "font-medium" : "font-normal"}`}>
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
        <div>
          <Link href="/">
            <span className="text-base font-medium md:text-lg">Artsbymat.</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
