"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * The signed-in user's picture inside a parent's round frame (the frame is the parent's: the account page
 * and the admin top bar size it differently). Served by app/account/avatar, which decides whose from the
 * session; `version` (when it last changed, ms) is part of the URL so a new picture shows at once.
 * Without one, or if it fails to load, the name's initial takes its place.
 */
export function AvatarPicture({ name, version, alt, sizes, initialClassName }: { name: string; version: number | null; alt: string; sizes: string; initialClassName: string }) {
  const [failed, setFailed] = useState<number | null>(null);
  if (version && failed !== version) {
    return <Image src={`/account/avatar?v=${version}`} alt={alt} fill sizes={sizes} unoptimized onError={() => setFailed(version)} className="object-cover" />;
  }
  return (
    <span aria-hidden className={cn("flex size-full items-center justify-center font-display text-gold-light uppercase", initialClassName)}>
      {name.trim().charAt(0) || "?"}
    </span>
  );
}
