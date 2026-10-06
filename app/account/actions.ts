"use server";

import { revalidatePath } from "next/cache";
import { checkAvatar } from "@/lib/auth/avatar";
import { unlinkGoogle } from "@/lib/auth/google";
import { profileSchema } from "@/lib/auth/schemas";
import { getSessionUser } from "@/lib/auth/user";
import { getDictionary } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

/**
 * The account page's own changes. Every action works on the signed-in user from the session cookie
 * (read and checked on the server); no user id is ever taken from the request, so nobody can reach
 * another account's profile or picture. A visitor without a valid session gets an error and nothing changes.
 */

export type ProfileState = { ok?: boolean; message?: string; error?: string; fieldErrors?: { name?: string }; name?: string };
export type AvatarResult = { ok: true; message: string } | { ok: false; error: string };

export async function updateProfileAction(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const t = await getDictionary();
  const p = t.account.profile;
  const raw = String(formData.get("name") ?? "");
  const user = await getSessionUser();
  if (!user) return { error: p.errors.session, name: raw };
  const parsed = profileSchema(t).safeParse({ name: raw });
  if (!parsed.success) return { fieldErrors: { name: parsed.error.issues[0]?.message }, name: raw };
  try {
    await prisma.user.update({ where: { id: user.id }, data: { name: parsed.data.name } });
  } catch (error) {
    console.error("profile update failed", error instanceof Error ? error.message : error);
    return { error: p.errors.failed, name: raw };
  }
  // The name also shows in the header's account menu.
  revalidatePath("/", "layout");
  return { ok: true, message: p.saved, name: parsed.data.name };
}

export async function updateAvatarAction(formData: FormData): Promise<AvatarResult> {
  const p = (await getDictionary()).account.profile;
  const user = await getSessionUser();
  if (!user) return { ok: false, error: p.errors.session };
  const file = formData.get("avatar");
  if (!(file instanceof File)) return { ok: false, error: p.errors.invalid };
  // Checked by size before reading, then by content (signature and dimensions), never by name or declared type.
  if (file.size > 256 * 1024) return { ok: false, error: p.errors.tooLarge };
  const bytes = new Uint8Array(await file.arrayBuffer());
  const checked = checkAvatar(bytes);
  if (!checked.ok) return { ok: false, error: p.errors[checked.reason] };
  try {
    await prisma.avatar.upsert({ where: { id: user.id }, create: { id: user.id, data: bytes, type: checked.type }, update: { data: bytes, type: checked.type } });
  } catch (error) {
    console.error("avatar upload failed", error instanceof Error ? error.message : error);
    return { ok: false, error: p.errors.failed };
  }
  revalidatePath("/account");
  return { ok: true, message: p.avatarSaved };
}

export async function removeAvatarAction(): Promise<AvatarResult> {
  const p = (await getDictionary()).account.profile;
  const user = await getSessionUser();
  if (!user) return { ok: false, error: p.errors.session };
  try {
    // Only this account's picture: its id is the user's id.
    await prisma.avatar.deleteMany({ where: { id: user.id } });
  } catch (error) {
    console.error("avatar removal failed", error instanceof Error ? error.message : error);
    return { ok: false, error: p.errors.failed };
  }
  revalidatePath("/account");
  return { ok: true, message: p.avatarRemoved };
}

/** Disconnects Google from the signed-in account, only while it can still sign in with its password. */
export async function unlinkGoogleAction(): Promise<AvatarResult> {
  const p = (await getDictionary()).account.profile;
  const user = await getSessionUser();
  if (!user) return { ok: false, error: p.errors.session };
  try {
    const result = await unlinkGoogle(user.id);
    if (result === "onlyMethod") return { ok: false, error: p.google.onlyMethod };
    if (result === "failed") return { ok: false, error: p.errors.failed };
  } catch (error) {
    console.error("google unlink failed", error instanceof Error ? error.message : error);
    return { ok: false, error: p.errors.failed };
  }
  revalidatePath("/account");
  return { ok: true, message: p.google.unlinked };
}
