import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

/**
 * The panel's frame. The check here only decides what the frame shows; every page and every data read
 * under it checks again (lib/admin/data.ts), since a layout doesn't re-run on client navigation.
 */
export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  // Only whether the admin has a picture and when it changed (one lookup by id, as on the account page);
  // the image itself is served to its owner by app/account/avatar.
  const avatar = await prisma.avatar.findUnique({ where: { id: user.id }, select: { updatedAt: true } });
  return <AdminShell user={{ name: user.name, email: user.email, avatarVersion: avatar ? avatar.updatedAt.getTime() : null }}>{children}</AdminShell>;
}
