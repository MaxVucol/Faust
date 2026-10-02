import type { Metadata } from "next";

/** Everything under /admin: never indexed. Access is checked by each page and action (lib/admin/auth.ts). */
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
