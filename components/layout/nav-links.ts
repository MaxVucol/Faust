export const NAV_LINKS = [
  { href: "/", label: "Acasă" },
  { href: "/produse", label: "Produse" },
  { href: "/despre-noi", label: "Despre noi" },
  { href: "/contact", label: "Contact" },
] as const;

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
