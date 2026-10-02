"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { MediaItem } from "@/lib/admin/data";

function MediaCard({ item }: { item: MediaItem }) {
  const [dims, setDims] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [broken, setBroken] = useState(false);
  const [copied, setCopied] = useState(false);
  return (
    <li className="group flex min-w-0 flex-col border border-gold-dark/40 bg-panel transition-colors hover:border-gold-dark/80">
      <span className="relative block aspect-[4/3] overflow-hidden border-b border-iron bg-panel-deep bg-[repeating-conic-gradient(rgb(255_255_255/0.025)_0_25%,transparent_0_50%)] bg-[length:16px_16px]">
        {broken ? (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-blood-text">File not found</span>
        ) : (
          <Image
            src={item.url}
            alt=""
            fill
            sizes="(min-width: 1280px) 18vw, (min-width: 640px) 30vw, 90vw"
            className="object-contain"
            onLoad={(e) => {
              const img = e.currentTarget;
              setDims(`${img.naturalWidth}×${img.naturalHeight}`);
              // The original file's size, from the CDN (the preview itself is a resized copy).
              fetch(item.url, { method: "HEAD" })
                .then((r) => {
                  const n = Number(r.headers.get("content-length"));
                  if (r.ok && n > 0) setSize(n >= 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);
                })
                .catch(() => {});
            }}
            onError={() => setBroken(true)}
          />
        )}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-3 py-3 text-sm">
        <p className="truncate text-parchment" title={item.name}>{item.name}</p>
        <p className="text-parchment-muted">
          {item.type}
          {dims && ` · ${dims}`}
          {size && ` · ${size}`}
        </p>
        <p className="truncate font-mono text-xs text-parchment-muted/80" title={item.url}>{item.url}</p>
        <ul className="mt-1 space-y-0.5 border-t border-iron/60 pt-1.5">
          {item.usedBy.slice(0, 3).map((u, i) => (
            <li key={i} className="truncate">
              <Link href={`/admin/games/${u.id}`} className="text-parchment-muted hover:text-gold-light">{u.field}: {u.title}</Link>
            </li>
          ))}
          {item.usedBy.length > 3 && <li className="text-parchment-muted">+{item.usedBy.length - 3} more</li>}
        </ul>
        <button
          type="button"
          onClick={() => navigator.clipboard?.writeText(item.url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }).catch(() => {})}
          className="mt-auto flex min-h-10 items-center gap-2 self-start pt-1 font-display-ui text-[0.62rem] text-gold-light transition-colors hover:text-[#e0c487]"
        >
          {copied ? <Check aria-hidden className="size-3.5" /> : <Copy aria-hidden className="size-3.5" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy path"}</span>
        </button>
      </div>
    </li>
  );
}

export function MediaGrid({ items }: { items: MediaItem[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 p-5 min-[30rem]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {items.map((m) => <MediaCard key={m.url} item={m} />)}
    </ul>
  );
}
