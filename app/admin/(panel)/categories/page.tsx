import type { Metadata } from "next";
import Link from "next/link";
import { GenreReassign } from "@/components/admin/GenreReassign";
import { Notice, PageHeader, Panel, Pill, Table, td, th } from "@/components/admin/ui";
import { getGenreStats } from "@/lib/admin/data";
import { dictionaries } from "@/lib/i18n/dictionaries";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const { genres, unknown, total } = await getGenreStats();
  return (
    <>
      <PageHeader
        title="Categories"
        description="The shop's genres. They are fixed keys with names in three languages (the catalogue filters, home tiles and translations rely on them), so a new genre is added in code; here you see their use and can move games between them."
      />
      {unknown.length > 0 && (
        <div className="mb-6">
          <Notice tone="error">Some games use genres the shop doesn&apos;t know ({unknown.map((u) => `${u.name}: ${u.games}`).join(", ")}). They don&apos;t appear in the filters; move them to a known genre below.</Notice>
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Panel title={`Genres · ${total} games`}>
          <Table>
            <thead>
              <tr>
                <th className={th}>Genre</th>
                <th className={th}>Romanian</th>
                <th className={`${th} hidden sm:table-cell`}>Russian</th>
                <th className={`${th} hidden md:table-cell`}>English</th>
                <th className={th}>Games</th>
              </tr>
            </thead>
            <tbody>
              {genres.map((g) => (
                <tr key={g.name} className="hover:bg-white/[0.02]">
                  <td className={td}>
                    <span className="block">{g.name}</span>
                    <span className="block text-xs text-parchment-muted">/produse?genre={g.name}</span>
                  </td>
                  <td className={td}>{dictionaries.ro.genres[g.name] ?? g.name}</td>
                  <td className={`${td} hidden sm:table-cell`}>{dictionaries.ru.genres[g.name] ?? g.name}</td>
                  <td className={`${td} hidden md:table-cell`}>{dictionaries.en.genres[g.name] ?? g.name}</td>
                  <td className={td}>
                    {g.games > 0 ? (
                      <Link href={`/admin/games?genre=${encodeURIComponent(g.name)}`} className="tabular-nums hover:text-gold-light">{g.games} games</Link>
                    ) : (
                      <Pill>empty</Pill>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Panel>
        <Panel title="Move games between genres">
          <GenreReassign from={[...genres, ...unknown].map((g) => ({ name: g.name, games: g.games }))} to={genres.map((g) => g.name)} />
        </Panel>
      </div>
    </>
  );
}
