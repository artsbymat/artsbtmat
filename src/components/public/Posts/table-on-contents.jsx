"use client";

import { useState } from "react";

export default function TableOfContents({ items = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickItem = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  if (items.length > 0) {
    return (
      <div className="h-fit border-l pl-4">
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="hover:text-link mb-2 flex w-full cursor-pointer items-center justify-between text-base font-medium"
        >
          <span>Table of Contents</span>
          <span className="text-sm">{isOpen ? "▾" : "▸"}</span>
        </button>

        {isOpen && (
          <ul className="space-y-2!">
            {items.map((item) => (
              <li
                key={item.id}
                onClick={() => handleClickItem(item.id)}
                className={`hover:text-link cursor-pointer list-none text-sm! font-light ${
                  item.level === 1 ? "" : item.level === 2 ? "ml-4" : item.level === 3 ? "ml-8" : ""
                }`}
              >
                {item.text}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}
