"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The shop's header and footer: shown everywhere except the admin panel, which has its own sidebar. */
export function HideOnAdmin({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname === "/admin" || pathname.startsWith("/admin/") ? null : children;
}
