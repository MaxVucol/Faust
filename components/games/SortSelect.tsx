"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SORT_OPTIONS, type SortValue } from "@/lib/catalog";

export function SortSelect({ value }: { value: SortValue }) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex items-center gap-3">
      <Label htmlFor="sort" className="mb-0 whitespace-nowrap">
        {t.catalog.sortBy}
      </Label>
      <Select
        id="sort"
        value={value}
        className="py-2"
        onChange={(e) => {
          const params = new URLSearchParams(searchParams);
          params.set("sort", e.target.value);
          params.delete("page");
          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o} value={o}>
            {t.sort[o]}
          </option>
        ))}
      </Select>
    </div>
  );
}
