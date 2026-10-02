import type { Metadata } from "next";
import { GameForm } from "@/components/admin/GameForm";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { gameToForm } from "@/lib/admin/game-form";

export const metadata: Metadata = { title: "Add game" };

export default async function NewGamePage() {
  await requireAdmin();
  return (
    <>
      <PageHeader title="Add game" description="The game appears in the shop as soon as it is created." />
      <GameForm id={null} initial={gameToForm(null)} />
    </>
  );
}
