"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminAccessError, assertAdmin } from "@/lib/admin/auth";
import { createUserSchema, gameSchema, issuesByPath, orderStatusSchema, saleSchema, updateUserSchema } from "@/lib/admin/schemas";
import { hashPassword } from "@/lib/auth/password";
import { endSession, LOGIN_PATH, revokeSessions, startSession } from "@/lib/auth/user";
import { GENRES } from "@/lib/catalog";
import type { AdminDictionary } from "@/lib/i18n/admin";
import { getAdminI18n } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

/**
 * The admin panel's writes. Each action checks the session itself (assertAdmin) before reading its
 * input: the panel's pages are not a security boundary, an action can be called without them. Inputs
 * are validated with lib/admin/schemas.ts; results carry only what the forms show, in the panel's language.
 */

export type ActionResult = { ok: true; message?: string; id?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

const ID = /^[a-f0-9]{24}$/;

async function guarded(run: (t: AdminDictionary) => Promise<ActionResult>): Promise<ActionResult> {
  const { t } = await getAdminI18n();
  const a = t.actions;
  try {
    await assertAdmin();
    return await run(t);
  } catch (error) {
    if (error instanceof AdminAccessError) {
      if (error.message === "Stale") return { ok: false, error: a.stale };
      return { ok: false, error: error.message === "Unauthorized" ? a.unauthorized : a.forbidden };
    }
    console.error("admin action failed", error instanceof Error ? error.message : error);
    return { ok: false, error: a.failed };
  }
}

/** Public pages read the catalogue on every request; this also refreshes any cached admin and sitemap views. */
function refresh() {
  revalidatePath("/", "layout");
}

// ---------- Session ----------
// Signing in happens on the site's /login (app/auth/actions.ts); the panel only signs out.

export async function logout(): Promise<void> {
  await endSession();
  redirect(LOGIN_PATH);
}

// ---------- Games ----------

export async function saveGame(id: string | null, input: unknown): Promise<ActionResult> {
  return guarded(async (t) => {
    const a = t.actions;
    if (id !== null && !ID.test(id)) return { ok: false, error: a.unknownGame };
    const parsed = gameSchema(t.validation).safeParse(input);
    if (!parsed.success) return { ok: false, error: a.checkFields, fieldErrors: issuesByPath(parsed.error) };
    const g = parsed.data;
    const clash = await prisma.game.findFirst({ where: { slug: g.slug, ...(id ? { id: { not: id } } : {}) }, select: { id: true } });
    if (clash) return { ok: false, error: a.checkFields, fieldErrors: { slug: a.slugTaken } };
    const data = {
      title: g.title,
      slug: g.slug,
      description: { ro: g.description.ro || null, ru: g.description.ru || null, en: g.description.en || null },
      developer: g.developer,
      publisher: g.publisher,
      releaseDate: g.releaseDate,
      genres: g.genres,
      platforms: g.platforms,
      price: g.price,
      discountPrice: g.discountPrice,
      discountStartsAt: g.discountPrice == null ? null : g.discountStartsAt,
      discountEndsAt: g.discountPrice == null ? null : g.discountEndsAt,
      stock: g.stock,
      rating: g.rating,
      coverImage: g.coverImage,
      cardImage: g.cardImage,
      pageCoverImage: g.pageCoverImage,
      screenshots: g.screenshots,
      featured: g.featured,
      variants: g.variants.map((v) => ({ ...v, ...(v.discountPrice == null ? { discountStartsAt: null, discountEndsAt: null } : {}) })),
    };
    if (id) {
      const exists = await prisma.game.findUnique({ where: { id }, select: { id: true } });
      if (!exists) return { ok: false, error: a.gameGone };
      // System requirements are not edited here and stay as they are.
      await prisma.game.update({ where: { id }, data });
      refresh();
      return { ok: true, id, message: a.gameSaved };
    }
    const created = await prisma.game.create({ data, select: { id: true } });
    refresh();
    return { ok: true, id: created.id, message: a.gameCreated };
  });
}

export async function deleteGame(id: string): Promise<ActionResult> {
  return guarded(async (t) => {
    const a = t.actions;
    if (!ID.test(id)) return { ok: false, error: a.unknownGame };
    const deleted = await prisma.game.deleteMany({ where: { id } });
    if (deleted.count === 0) return { ok: false, error: a.gameAlreadyDeleted };
    refresh();
    return { ok: true, message: a.gameDeleted };
  });
}

// ---------- Discounts ----------

export async function saveSale(input: unknown): Promise<ActionResult> {
  return guarded(async (t) => {
    const a = t.actions;
    const parsed = saleSchema(t.validation).safeParse(input);
    if (!parsed.success) return { ok: false, error: a.checkFields, fieldErrors: issuesByPath(parsed.error) };
    const s = parsed.data;
    const game = await prisma.game.findUnique({ where: { id: s.gameId }, select: { price: true, variants: true } });
    if (!game) return { ok: false, error: a.gameGone };
    const sale = s.discountPrice == null ? { discountPrice: null, discountStartsAt: null, discountEndsAt: null } : { discountPrice: s.discountPrice, discountStartsAt: s.discountStartsAt, discountEndsAt: s.discountEndsAt };
    if (s.variant === null) {
      if (s.discountPrice != null && s.discountPrice >= game.price) return { ok: false, error: a.checkFields, fieldErrors: { discountPrice: t.validation.saleBelowPrice } };
      await prisma.game.update({ where: { id: s.gameId }, data: sale });
    } else {
      const v = game.variants[s.variant];
      if (!v || v.price == null) return { ok: false, error: a.versionChanged };
      if (s.discountPrice != null && s.discountPrice >= v.price) return { ok: false, error: a.checkFields, fieldErrors: { discountPrice: t.validation.saleBelowPrice } };
      const variants = game.variants.map((x, i) => (i === s.variant ? { ...x, ...sale } : x));
      await prisma.game.update({ where: { id: s.gameId }, data: { variants } });
    }
    refresh();
    return { ok: true, message: s.discountPrice == null ? a.saleRemoved : a.saleSaved };
  });
}

// ---------- Orders ----------

export async function updateOrderStatus(input: unknown): Promise<ActionResult> {
  return guarded(async (t) => {
    const a = t.actions;
    const parsed = orderStatusSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: a.invalidStatus };
    const { id, status, paymentStatus } = parsed.data;
    const updated = await prisma.order.updateMany({ where: { id }, data: { status, paymentStatus } });
    if (updated.count === 0) return { ok: false, error: a.orderGone };
    revalidatePath("/admin", "layout");
    return { ok: true, message: a.orderUpdated };
  });
}

// ---------- Users ----------

/** Whether another active admin would remain if `id` stopped being one (the panel must never lock everyone out). */
async function anotherAdmin(id: string) {
  return (await prisma.user.count({ where: { role: "admin", status: "active", id: { not: id } } })) > 0;
}

export async function createUser(input: unknown): Promise<ActionResult> {
  return guarded(async (t) => {
    const a = t.actions;
    const parsed = createUserSchema(t.validation).safeParse(input);
    if (!parsed.success) return { ok: false, error: a.checkFields, fieldErrors: issuesByPath(parsed.error) };
    const { password, ...u } = parsed.data;
    if (await prisma.user.findUnique({ where: { email: u.email }, select: { id: true } })) return { ok: false, error: a.checkFields, fieldErrors: { email: a.emailTaken } };
    const created = await prisma.user.create({ data: { ...u, passwordHash: await hashPassword(password), sessionVersion: 0 }, select: { id: true } });
    revalidatePath("/admin", "layout");
    return { ok: true, id: created.id, message: a.userCreated };
  });
}

export async function updateUser(input: unknown): Promise<ActionResult> {
  return guarded(async (t) => {
    const a = t.actions;
    const me = await assertAdmin();
    const parsed = updateUserSchema(t.validation).safeParse(input);
    if (!parsed.success) return { ok: false, error: a.checkFields, fieldErrors: issuesByPath(parsed.error) };
    const { id, password, ...u } = parsed.data;
    const current = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true } });
    if (!current) return { ok: false, error: a.userGone };
    const losesAdmin = current.role === "admin" && current.status === "active" && (u.role !== "admin" || u.status !== "active");
    if (losesAdmin && id === me.id) return { ok: false, error: a.ownAdmin };
    if (losesAdmin && !(await anotherAdmin(id))) return { ok: false, error: a.lastAdmin };
    await prisma.user.update({ where: { id }, data: { ...u, ...(password ? { passwordHash: await hashPassword(password) } : {}) } });
    // A new password, a block or losing the admin role ends every session of that account.
    const blocked = current.status === "active" && u.status !== "active";
    const demoted = current.role === "admin" && u.role !== "admin";
    if (password || blocked || demoted) {
      const version = await revokeSessions(id);
      // Changing your own password keeps you signed in here, with a new session.
      if (id === me.id) await startSession(id, version);
    }
    revalidatePath("/admin", "layout");
    return { ok: true, message: a.userSaved };
  });
}

export async function deleteUser(id: string): Promise<ActionResult> {
  return guarded(async (t) => {
    const a = t.actions;
    const me = await assertAdmin();
    if (!ID.test(id)) return { ok: false, error: a.unknownUser };
    if (id === me.id) return { ok: false, error: a.ownAccount };
    const user = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true } });
    if (!user) return { ok: false, error: a.userAlreadyDeleted };
    if (user.role === "admin" && user.status === "active" && !(await anotherAdmin(id))) return { ok: false, error: a.lastAdmin };
    // Deleting the account also ends its sessions (the account no longer exists), and its picture goes with it.
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin", "layout");
    return { ok: true, message: a.userDeleted };
  });
}

// ---------- Categories ----------

/** Moves every game from one genre to another (genres are fixed keys with translations in the dictionaries). */
export async function reassignGenre(from: string, to: string): Promise<ActionResult> {
  return guarded(async (t) => {
    const a = t.actions;
    const names: string[] = GENRES.map((g) => g.name);
    if (typeof from !== "string" || typeof to !== "string" || !names.includes(to) || from === to || from.length > 60) return { ok: false, error: a.chooseGenres };
    const games = await prisma.game.findMany({ where: { genres: { has: from } }, select: { id: true, genres: true } });
    await prisma.$transaction(games.map((g) => prisma.game.update({ where: { id: g.id }, data: { genres: [...new Set(g.genres.map((x) => (x === from ? to : x)))] } })));
    refresh();
    return { ok: true, message: a.moved(games.length, to) };
  });
}

