import type { Metadata } from "next";
import { GameForm } from "@/components/admin/GameForm";
import { BackLink, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { gameToForm } from "@/lib/admin/game-form";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.addGame };
}

export default async function NewGamePage() {
  const [, { t }] = await Promise.all([requireAdmin(), getAdminI18n()]);
  return (
    <>
      <BackLink href="/admin/games">{t.common.allGames}</BackLink>
      <PageHeader title={t.meta.addGame} description={t.gameEdit.newDescription} />
      <GameForm id={null} initial={gameToForm(null)} />
    </>
  );
}
