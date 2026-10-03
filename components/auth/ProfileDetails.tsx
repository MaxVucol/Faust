"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Camera, PenLine } from "lucide-react";
import { removeAvatarAction, updateAvatarAction, updateProfileAction, type ProfileState } from "@/app/account/actions";
import { AvatarPicture } from "@/components/auth/AvatarPicture";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label } from "@/components/ui/Input";
import { AVATAR_MIN_SIDE, AVATAR_SIZE, AVATAR_SOURCE_MAX_BYTES, AVATAR_TYPES } from "@/lib/auth/avatar";
import { cn } from "@/lib/utils";

type Props = {
  name: string;
  email: string;
  statusText: string;
  memberSince: string | null;
  /** When the picture last changed (ms), or null without one; part of its URL so a new one shows at once. */
  avatarVersion: number | null;
};

/** The account page's existing details list (the same markup and classes as before) with profile editing and a picture. */
const row = "grid grid-cols-[9rem_1fr] items-baseline gap-4 border-b border-iron/60 py-3 last:border-b-0 sm:grid-cols-[12rem_1fr]";
const quiet = "min-h-10 px-1 text-left font-display-ui text-[0.66rem] underline-offset-4 transition-colors hover:underline disabled:cursor-wait disabled:opacity-60";
const framed = "inline-flex min-h-11 items-center gap-2 border border-iron px-5 font-display-ui text-[0.7rem] text-parchment transition-colors hover:border-aged-gold hover:text-gold-light disabled:cursor-wait disabled:opacity-60";

/** Crops the chosen image to a centred square and re-encodes it at AVATAR_SIZE (WebP, else JPEG). */
async function toAvatar(file: File): Promise<{ blob: Blob } | { error: "type" | "tooLarge" | "invalid" }> {
  if (!(AVATAR_TYPES as readonly string[]).includes(file.type)) return { error: "type" };
  if (file.size > AVATAR_SOURCE_MAX_BYTES) return { error: "tooLarge" };
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return { error: "invalid" };
  }
  const side = Math.min(bitmap.width, bitmap.height);
  if (side < AVATAR_MIN_SIDE) return { error: "invalid" };
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = AVATAR_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return { error: "invalid" };
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, AVATAR_SIZE, AVATAR_SIZE);
  bitmap.close();
  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.86));
  const webp = await encode("image/webp");
  const blob = webp && webp.type === "image/webp" ? webp : await encode("image/jpeg");
  return blob ? { blob } : { error: "invalid" };
}

export function ProfileDetails({ name, email, statusText, memberSince, avatarVersion }: Props) {
  const { t } = useI18n();
  const a = t.account;
  const p = a.profile;
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [state, action, saving] = useActionState<ProfileState, FormData>(updateProfileAction, {});
  const [draft, setDraft] = useState(name);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [uploading, startUpload] = useTransition();
  const file = useRef<HTMLInputElement>(null);
  const editButton = useRef<HTMLButtonElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);

  // A successful save closes the form; the page re-renders with the saved name.
  const [handled, setHandled] = useState(state);
  if (state !== handled) {
    setHandled(state);
    if (state.ok) {
      setEditing(false);
      setNotice({ tone: "ok", text: state.message ?? p.saved });
    }
  }
  useEffect(() => {
    if (editing) nameInput.current?.focus();
  }, [editing]);

  const open = () => {
    setDraft(name);
    setNotice(null);
    setEditing(true);
  };
  // Cancel only resets the form; nothing is sent.
  const cancel = () => {
    setDraft(name);
    setEditing(false);
    requestAnimationFrame(() => editButton.current?.focus());
  };

  const upload = (chosen: File) =>
    startUpload(async () => {
      setNotice(null);
      const result = await toAvatar(chosen);
      if ("error" in result) {
        setNotice({ tone: "error", text: p.errors[result.error] });
        return;
      }
      const data = new FormData();
      data.append("avatar", result.blob, result.blob.type === "image/webp" ? "avatar.webp" : "avatar.jpg");
      const r = await updateAvatarAction(data);
      setNotice(r.ok ? { tone: "ok", text: r.message } : { tone: "error", text: r.error });
      if (r.ok) router.refresh();
    });

  const remove = () =>
    startUpload(async () => {
      setNotice(null);
      const r = await removeAvatarAction();
      setNotice(r.ok ? { tone: "ok", text: r.message } : { tone: "error", text: r.error });
      if (r.ok) router.refresh();
    });

  const fieldError = state.fieldErrors?.name;

  return (
    <div className="mt-5">
      {/* The picture: a round plate in the page's dark-gold frame; the initial until one is uploaded. */}
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => file.current?.click()}
          disabled={uploading}
          aria-label={avatarVersion ? p.changeAvatar : p.uploadAvatar}
          className="group relative size-20 shrink-0 overflow-hidden rounded-full border border-gold-dark/80 bg-[#0b0907] transition-colors hover:border-gold-light disabled:cursor-wait sm:size-24"
        >
          <AvatarPicture name={name} version={avatarVersion} alt={p.avatarAlt} sizes="96px" initialClassName="text-3xl" />
          <span aria-hidden className={cn("absolute inset-0 flex items-center justify-center bg-black/55 transition-opacity", uploading ? "opacity-100" : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100")}>
            <Camera className={cn("size-5 text-gold-light", uploading && "animate-slow-pulse")} strokeWidth={1.5} />
          </span>
        </button>
        <div className="min-w-0">
          <div className="flex flex-wrap gap-x-5">
            <button type="button" onClick={() => file.current?.click()} disabled={uploading} className={cn(quiet, "text-gold-light hover:text-[#e0c487]")}>
              {uploading ? p.uploading : avatarVersion ? p.changeAvatar : p.uploadAvatar}
            </button>
            {avatarVersion && (
              <button type="button" onClick={remove} disabled={uploading} className={cn(quiet, "text-parchment-muted hover:text-blood-text")}>
                {p.removeAvatar}
              </button>
            )}
          </div>
          <p className="text-sm text-parchment-muted">{p.avatarHint}</p>
        </div>
        <input
          ref={file}
          type="file"
          accept={AVATAR_TYPES.join(",")}
          className="sr-only"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            const chosen = e.target.files?.[0];
            e.target.value = "";
            if (chosen) upload(chosen);
          }}
        />
      </div>

      {notice && (
        <p role={notice.tone === "error" ? "alert" : "status"} className={cn("mt-4 border-l-2 pl-3", notice.tone === "error" ? "border-blood-text text-blood-text" : "border-stock-in text-parchment")}>
          {notice.text}
        </p>
      )}

      {editing ? (
        <form action={action} noValidate className="mt-4">
          {state.error && (
            <p role="alert" className="mb-4 border-l-2 border-blood-text pl-3 text-blood-text">
              {state.error}
            </p>
          )}
          <fieldset disabled={saving} className="space-y-5">
            <div>
              <Label htmlFor="profile-name">{a.name}</Label>
              <Input
                ref={nameInput}
                id="profile-name"
                name="name"
                autoComplete="name"
                required
                maxLength={80}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                aria-invalid={fieldError ? true : undefined}
                aria-describedby={fieldError ? "profile-name-error" : undefined}
              />
              <FieldError id="profile-name-error" errors={fieldError ? [fieldError] : undefined} />
            </div>
            <div>
              <Label htmlFor="profile-email">{a.email}</Label>
              <Input id="profile-email" value={email} readOnly aria-describedby="profile-email-note" className="opacity-70" />
              <p id="profile-email-note" className="mt-2 text-sm text-parchment-muted">{p.emailNote}</p>
            </div>
          </fieldset>
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={cancel} disabled={saving} className={framed}>
              {p.cancel}
            </button>
            <Button type="submit" variant="gold" size="sm" disabled={saving} className="min-h-11 sm:min-w-48">
              {saving ? p.saving : p.save}
            </Button>
          </div>
        </form>
      ) : (
        <>
          <dl className="mt-2">
            <div className={row}>
              <dt className="text-parchment-muted">{a.name}</dt>
              <dd className="min-w-0 break-words">{name}</dd>
            </div>
            <div className={row}>
              <dt className="text-parchment-muted">{a.email}</dt>
              <dd className="min-w-0 break-all">{email}</dd>
            </div>
            <div className={row}>
              <dt className="text-parchment-muted">{a.status}</dt>
              <dd className="text-stock-in">{statusText}</dd>
            </div>
            {memberSince && (
              <div className={row}>
                <dt className="text-parchment-muted">{a.memberSince}</dt>
                <dd className="tabular-nums">{memberSince}</dd>
              </div>
            )}
          </dl>
          <button ref={editButton} type="button" onClick={open} className={cn(framed, "mt-4")}>
            <PenLine aria-hidden className="size-4" strokeWidth={1.75} />
            {p.edit}
          </button>
        </>
      )}
    </div>
  );
}
