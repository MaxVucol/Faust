import type { SystemRequirements as Requirements } from "@prisma/client";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const FIELDS = ["os", "processor", "memory", "graphics", "directX", "storage"] as const;

type Props = {
  requirements: Requirements | null;
  /** Whether the game is sold for PC at all. */
  onPc: boolean;
  t: Dictionary["game"];
};

/**
 * The "System requirements" tab. Shows the game's own verified PC requirements (minimum and/or
 * recommended), only the rows the publisher lists, and where they come from. Without verified data
 * it says so instead of showing anything generic; console-only games keep their own message.
 */
export function SystemRequirements({ requirements, onPc, t }: Props) {
  if (!onPc) return <p className="text-parchment-muted">{t.consoleOnly}</p>;
  if (!requirements || (!requirements.minimum && !requirements.recommended)) {
    return <p className="text-parchment-muted">{t.requirementsUnavailable}</p>;
  }

  const columns = [
    { label: t.minimum, set: requirements.minimum },
    { label: t.recommended, set: requirements.recommended },
  ].filter((c) => c.set);
  const rows = FIELDS.filter((f) => columns.some((c) => c.set?.[f]));

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-[1.05rem] sm:text-[1.15rem]">
          <thead>
            <tr className="border-b border-iron font-display-ui text-[0.8rem] text-parchment-muted">
              <th scope="col" className="py-4 pr-5 font-normal">
                {t.component}
              </th>
              {columns.map((c) => (
                <th key={c.label} scope="col" className="py-4 pr-5 font-normal last:pr-0">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((f) => (
              <tr key={f} className="border-b border-iron align-top">
                <th scope="row" className="py-4 pr-5 font-normal whitespace-nowrap text-parchment-muted">
                  {t.requirementRows[f]}
                </th>
                {columns.map((c) => (
                  <td key={c.label} className="py-4 pr-5 last:pr-0">
                    {c.set?.[f] ?? <span className="text-parchment-muted">{t.notListed}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-parchment-muted">
        <a href={requirements.source} target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-gold-light hover:underline">
          {t.requirementsSource}
        </a>
      </p>
    </div>
  );
}
