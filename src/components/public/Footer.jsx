import { UI } from "@/data/constants";
import Image from "next/image";
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
        <Image
          src="https://wakatime.com/badge/user/cb7cf757-e629-4d2a-b8b2-840c3681d84a/project/3b34ffda-951b-4f0d-b516-3400da565f72.svg?style=flat-square"
          alt="Wakatime"
          width={180}
          height={180}
        />
      </nav>
    </footer>
  );
}
