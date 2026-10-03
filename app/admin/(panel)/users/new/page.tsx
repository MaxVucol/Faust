import type { Metadata } from "next";
import { UserForm } from "@/components/admin/UserForm";
import { BackLink, PageHeader, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.addUser };
}

export default async function NewUserPage() {
  const [, { t }] = await Promise.all([requireAdmin(), getAdminI18n()]);
  return (
    <>
      <BackLink href="/admin/users">{t.common.allUsers}</BackLink>
      <PageHeader title={t.meta.addUser} description={t.user.newDescription} />
      <Panel className="max-w-3xl px-5 py-6 sm:px-6">
        <UserForm id={null} initial={{ name: "", email: "", role: "admin", status: "active", password: "" }} />
      </Panel>
    </>
  );
}
