import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";

/**
 * The panel's frame. The check here only decides what the frame shows; every page and every data read
 * under it checks again (lib/admin/data.ts), since a layout doesn't re-run on client navigation.
 */
export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  return <AdminShell user={{ name: user.name, email: user.email }}>{children}</AdminShell>;
}
