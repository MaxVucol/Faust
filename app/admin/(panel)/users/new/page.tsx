import type { Metadata } from "next";
import { UserForm } from "@/components/admin/UserForm";
import { PageHeader, Panel } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Add user" };

export default async function NewUserPage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add user" description="Give the person their email and password yourself; there is no sign-up or email invitation." />
      <Panel className="max-w-3xl px-5 py-6 sm:px-6">
        <UserForm id={null} initial={{ name: "", email: "", role: "admin", status: "active", password: "" }} />
      </Panel>
    </>
  );
}
