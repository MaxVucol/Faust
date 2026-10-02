import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { deleteGame } from "@/app/admin/actions";
import { ConfirmDelete } from "@/components/admin/ConfirmDelete";
import { GameForm } from "@/components/admin/GameForm";
import { adminDateTime, Notice, PageHeader, UrlNotice } from "@/components/admin/ui";
import { getGameForEdit } from "@/lib/admin/data";
import { gameToForm } from "@/lib/admin/game-form";

export const metadata: Metadata = { title: "Edit game" };

export default async function EditGamePage({ params, searchParams }: PageProps<"/admin/games/[id]">) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const game = await getGameForEdit(id);
  if (!game) notFound();
  return (
    <>
      <PageHeader
        title={game.title}
        description={<>Added {adminDateTime(game.createdAt)} · last changed {adminDateTime(game.updatedAt)}</>}
        actions={
          <>
            <Link href={`/produse/${game.slug}`} target="_blank" className="inline-flex min-h-10 items-center gap-2 border border-iron px-4 font-display-ui text-[0.66rem] text-parchment-muted hover:border-aged-gold hover:text-gold-light">
              <ExternalLink aria-hidden className="size-4" /> View in shop
            </Link>
            <ConfirmDelete action={deleteGame.bind(null, game.id)} name={game.title} redirectTo="/admin/games" />
          </>
        }
      />
      <UrlNotice code={sp.notice} />
      {game.systemRequirements && (
        <div className="mb-6">
          <Notice tone="info">PC system requirements are kept as they are; they are not edited here.</Notice>
        </div>
      )}
      <GameForm id={game.id} initial={gameToForm(game)} />
    </>
  );
}
