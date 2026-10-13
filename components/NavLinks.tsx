"use client";

import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/types";

export function NavLinks({ items }: { items: NavItem[] }) {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    const elements = items
      .map((item) => (item.href.startsWith("#") ? document.getElementById(item.href.slice(1)) : null))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setCurrent(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.6] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="nav" aria-label="Sekcje strony">
      {items
        .filter((item) => item.label.trim() && item.href.trim())
        .map((item) => (
          <a key={item.id} href={item.href} aria-current={current === item.href ? "true" : undefined}>
            {item.label}
          </a>
        ))}
    </nav>
  );
}
