import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { deleteGame } from "@/app/admin/actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { GameForm } from "@/components/admin/GameForm";
import { adminDateTime, BackLink, btn, Notice, PageHeader, UrlNotice } from "@/components/admin/ui";
import { getGameForEdit } from "@/lib/admin/data";
import { gameToForm } from "@/lib/admin/game-form";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.editGame };
}

export default async function EditGamePage({ params, searchParams }: PageProps<"/admin/games/[id]">) {
  const [{ id }, sp, { t, locale }] = await Promise.all([params, searchParams, getAdminI18n()]);
  const game = await getGameForEdit(id);
  if (!game) notFound();
  return (
    <>
      <BackLink href="/admin/games">{t.common.allGames}</BackLink>
      <PageHeader
        title={game.title}
        description={t.gameEdit.meta(adminDateTime(game.createdAt, locale), adminDateTime(game.updatedAt, locale))}
        actions={
          <>
            <Link href={`/produse/${game.slug}`} target="_blank" className={btn("ghost")}>
              <ExternalLink aria-hidden className="size-4" /> {t.common.viewInShop}
            </Link>
            <ConfirmDelete action={deleteGame.bind(null, game.id)} name={game.title} redirectTo="/admin/games" />
          </>
        }
      />
      <UrlNotice code={sp.notice} t={t} />
      {game.systemRequirements && (
        <div className="mb-6">
          <Notice tone="info">{t.gameEdit.sysReqNotice}</Notice>
        </div>
      )}
      <GameForm id={game.id} initial={gameToForm(game)} />
    </>
  );
}
