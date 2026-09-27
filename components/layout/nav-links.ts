/** Labels are dictionary keys under t.nav. */
export const NAV_LINKS = [
  { href: "/", key: "home" },
  { href: "/produse", key: "products" },
  { href: "/despre-noi", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
