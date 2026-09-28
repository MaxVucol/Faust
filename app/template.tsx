"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { NAV_LINKS, isActive } from "@/components/layout/nav-links";

/** Position of a path in the main navigation (0–3), or -1 for pages outside it (game pages, cart…). */
function navIndex(pathname: string): number {
  // Match the most specific link first so "/" doesn't claim every page.
  const byLength = [...NAV_LINKS].sort((a, b) => b.href.length - a.href.length);
  const hit = byLength.find((l) => isActive(pathname, l.href));
  return hit ? NAV_LINKS.indexOf(hit) : -1;
}

// Survives between navigations (the template itself remounts each time); written only in an effect.
const history: { previousIndex: number | null } = { previousIndex: null };

/**
 * Re-mounts on every navigation, so each page arrives with an entrance animation. Moving right
 * along the main menu (Home → Products → About → Contact) slides the page in from the right,
 * moving left slides it in from the left; anything else rises gently into place.
 */
export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const index = navIndex(pathname);

  // Chosen once per mount, from where the visitor came from.
  const [animation] = useState(() => {
    const prev = history.previousIndex;
    if (prev === null || prev < 0 || index < 0 || prev === index) return "animate-page-rise";
    return index > prev ? "animate-page-from-right" : "animate-page-from-left";
  });

  useEffect(() => {
    history.previousIndex = index;
  }, [index]);

  return <div className={animation}>{children}</div>;
}
