import type { Metadata } from "next";
import Link from "next/link";
import { GenreReassign } from "@/components/admin/GenreReassign";
import { Notice, PageHeader, Panel, Pill, Table, td, th, tr } from "@/components/admin/ui";
import { getGenreStats } from "@/lib/admin/data";
import { LOCALE_NAMES, LOCALES } from "@/lib/i18n/config";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { getAdminI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return { title: (await getAdminI18n()).t.meta.categories };
}

export default async function CategoriesPage() {
  const [{ genres, unknown, total }, { t }] = await Promise.all([getGenreStats(), getAdminI18n()]);
  const C = t.categories;
  return (
    <>
      <PageHeader
       
        title={C.title}
        description={C.description}
      />
      {unknown.length > 0 && (
        <div className="mb-6">
          <Notice tone="error">{C.unknown(unknown.map((u) => `${u.name}: ${u.games}`).join(", "))}</Notice>
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Panel title={C.genresPanel(total)}>
          <Table>
            <thead>
              <tr>
                <th className={th}>{C.genre}</th>
                {LOCALES.map((l, i) => (
                  <th key={l} lang={l} className={`${th} ${i === 1 ? "hidden sm:table-cell" : i > 1 ? "hidden md:table-cell" : ""}`}>{LOCALE_NAMES[l]}</th>
                ))}
                <th className={th}>{C.games}</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((g) => (
                <tr key={g.name} className={tr}>
                  <td className={td}>
                    <span className="block text-parchment">{g.name}</span>
                    <span className="block text-xs text-parchment-muted">/produse?genre={g.name}</span>
                  </td>
                  {LOCALES.map((l, i) => (
                    <td key={l} lang={l} className={`${td} ${i === 1 ? "hidden sm:table-cell" : i > 1 ? "hidden md:table-cell" : ""}`}>{dictionaries[l].genres[g.name] ?? g.name}</td>
                  ))}
                  <td className={td}>
                    {g.games > 0 ? (
                      <Link href={`/admin/games?genre=${encodeURIComponent(g.name)}`} className="whitespace-nowrap text-gold-light tabular-nums underline-offset-4 hover:text-[#e0c487] hover:underline">{C.gamesCount(g.games)}</Link>
                    ) : (
                      <Pill>{C.emptyGenre}</Pill>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>
        <Panel title={C.movePanel}>
          <GenreReassign from={[...genres, ...unknown].map((g) => ({ name: g.name, games: g.games }))} to={genres.map((g) => g.name)} />
        </Panel>
      </div>
    </>
  );
}
