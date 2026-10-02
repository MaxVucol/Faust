import type { Metadata } from "next";
import { GameForm } from "@/components/admin/GameForm";
import { BackLink, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { gameToForm } from "@/lib/admin/game-form";

export const metadata: Metadata = { title: "Add game" };

export default async function NewGamePage() {
  await requireAdmin();
  return (
    <>
      <BackLink href="/admin/games">All games</BackLink>
      <PageHeader eyebrow="Catalogue · New game" title="Add game" description="The game appears in the shop as soon as it is created." />
      <GameForm id={null} initial={gameToForm(null)} />
    </>
  );
}
