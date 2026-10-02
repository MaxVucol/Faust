"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminAccessError, assertAdmin } from "@/lib/admin/auth";
import { hashPassword, verifyPassword } from "@/lib/admin/password";
import { createUserSchema, gameSchema, issuesByPath, loginSchema, orderStatusSchema, saleSchema, updateUserSchema } from "@/lib/admin/schemas";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE, sessionsConfigured } from "@/lib/admin/session";
import { GENRES } from "@/lib/catalog";
import { prisma } from "@/lib/prisma";
import { allowAttempt, clientIp } from "@/lib/rate-limit";

/**
 * The admin panel's writes. Each action checks the session itself (assertAdmin) before reading its
 * input: the panel's pages are not a security boundary, an action can be called without them. Inputs
 * are validated with lib/admin/schemas.ts; results carry only what the forms show.
 */

export type ActionResult = { ok: true; message?: string; id?: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

const ID = /^[a-f0-9]{24}$/;

async function guarded(run: () => Promise<ActionResult>): Promise<ActionResult> {
  try {
    await assertAdmin();
    return await run();
  } catch (error) {
    if (error instanceof AdminAccessError) return { ok: false, error: error.message === "Unauthorized" ? "Your session has ended. Sign in again." : "You don't have permission to do this." };
    console.error("admin action failed", error instanceof Error ? error.message : error);
    return { ok: false, error: "Something went wrong while saving. Nothing was changed; please try again." };
  }
}

/** Public pages read the catalogue on every request; this also refreshes any cached admin and sitemap views. */
function refresh() {
  revalidatePath("/", "layout");
}

// ---------- Session ----------

export type LoginState = { error?: string; fieldErrors?: Record<string, string>; email?: string };

// Compared against when the email is unknown, so a wrong email takes as long as a wrong password.
const DUMMY_HASH = "scrypt$32768$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").slice(0, 200);
  if (!sessionsConfigured()) return { error: "Admin sign-in is not configured on this server (ADMIN_SESSION_SECRET).", email };
  const parsed = loginSchema.safeParse({ email, password: String(formData.get("password") ?? "") });
  if (!parsed.success) return { fieldErrors: issuesByPath(parsed.error), email };
  if (!allowAttempt(`admin-login:${await clientIp()}`, 10, 15 * 60 * 1000)) return { error: "Too many attempts. Wait a few minutes and try again.", email };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email }, select: { id: true, passwordHash: true } });
  const valid = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return { error: "Wrong email or password.", email };

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  (await cookies()).set(SESSION_COOKIE, createSessionToken(user.id), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  const next = String(formData.get("next") ?? "");
  // Only back into the panel, never to another site.
  redirect(/^\/admin(\/[a-z0-9\-/]*)?(\?[^\s]*)?$/i.test(next) && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}

// ---------- Games ----------

export async function saveGame(id: string | null, input: unknown): Promise<ActionResult> {
  return guarded(async () => {
    if (id !== null && !ID.test(id)) return { ok: false, error: "Unknown game." };
    const parsed = gameSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: issuesByPath(parsed.error) };
    const g = parsed.data;
    const clash = await prisma.game.findFirst({ where: { slug: g.slug, ...(id ? { id: { not: id } } : {}) }, select: { id: true } });
    if (clash) return { ok: false, error: "Check the highlighted fields.", fieldErrors: { slug: "Another game already uses this slug" } };
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
      if (!exists) return { ok: false, error: "This game no longer exists." };
      // System requirements are not edited here and stay as they are.
      await prisma.game.update({ where: { id }, data });
      refresh();
      return { ok: true, id, message: "Game saved." };
    }
    const created = await prisma.game.create({ data, select: { id: true } });
    refresh();
    return { ok: true, id: created.id, message: "Game created." };
  });
}

export async function deleteGame(id: string): Promise<ActionResult> {
  return guarded(async () => {
    if (!ID.test(id)) return { ok: false, error: "Unknown game." };
    const deleted = await prisma.game.deleteMany({ where: { id } });
    if (deleted.count === 0) return { ok: false, error: "This game was already deleted." };
    refresh();
    return { ok: true, message: "Game deleted." };
  });
}

// ---------- Discounts ----------

export async function saveSale(input: unknown): Promise<ActionResult> {
  return guarded(async () => {
    const parsed = saleSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: issuesByPath(parsed.error) };
    const s = parsed.data;
    const game = await prisma.game.findUnique({ where: { id: s.gameId }, select: { price: true, variants: true } });
    if (!game) return { ok: false, error: "This game no longer exists." };
    const sale = s.discountPrice == null ? { discountPrice: null, discountStartsAt: null, discountEndsAt: null } : { discountPrice: s.discountPrice, discountStartsAt: s.discountStartsAt, discountEndsAt: s.discountEndsAt };
    if (s.variant === null) {
      if (s.discountPrice != null && s.discountPrice >= game.price) return { ok: false, error: "Check the highlighted fields.", fieldErrors: { discountPrice: "Sale price must be lower than the price" } };
      await prisma.game.update({ where: { id: s.gameId }, data: sale });
    } else {
      const v = game.variants[s.variant];
      if (!v || v.price == null) return { ok: false, error: "This version changed; reload the page." };
      if (s.discountPrice != null && s.discountPrice >= v.price) return { ok: false, error: "Check the highlighted fields.", fieldErrors: { discountPrice: "Sale price must be lower than the price" } };
      const variants = game.variants.map((x, i) => (i === s.variant ? { ...x, ...sale } : x));
      await prisma.game.update({ where: { id: s.gameId }, data: { variants } });
    }
    refresh();
    return { ok: true, message: s.discountPrice == null ? "Sale removed." : "Sale saved." };
  });
}

// ---------- Orders ----------

export async function updateOrderStatus(input: unknown): Promise<ActionResult> {
  return guarded(async () => {
    const parsed = orderStatusSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Choose a valid status." };
    const { id, status, paymentStatus } = parsed.data;
    const updated = await prisma.order.updateMany({ where: { id }, data: { status, paymentStatus } });
    if (updated.count === 0) return { ok: false, error: "This order no longer exists." };
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Order updated." };
  });
}

// ---------- Users ----------

/** Whether another active admin would remain if `id` stopped being one (the panel must never lock everyone out). */
async function anotherAdmin(id: string) {
  return (await prisma.user.count({ where: { role: "admin", status: "active", id: { not: id } } })) > 0;
}

export async function createUser(input: unknown): Promise<ActionResult> {
  return guarded(async () => {
    const parsed = createUserSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: issuesByPath(parsed.error) };
    const { password, ...u } = parsed.data;
    if (await prisma.user.findUnique({ where: { email: u.email }, select: { id: true } })) return { ok: false, error: "Check the highlighted fields.", fieldErrors: { email: "An account with this email already exists" } };
    const created = await prisma.user.create({ data: { ...u, passwordHash: await hashPassword(password) }, select: { id: true } });
    revalidatePath("/admin", "layout");
    return { ok: true, id: created.id, message: "User created." };
  });
}

export async function updateUser(input: unknown): Promise<ActionResult> {
  return guarded(async () => {
    const me = await assertAdmin();
    const parsed = updateUserSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "Check the highlighted fields.", fieldErrors: issuesByPath(parsed.error) };
    const { id, password, ...u } = parsed.data;
    const current = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true } });
    if (!current) return { ok: false, error: "This user no longer exists." };
    const losesAdmin = current.role === "admin" && current.status === "active" && (u.role !== "admin" || u.status !== "active");
    if (losesAdmin && id === me.id) return { ok: false, error: "You can't remove your own admin access." };
    if (losesAdmin && !(await anotherAdmin(id))) return { ok: false, error: "At least one active admin must remain." };
    await prisma.user.update({ where: { id }, data: { ...u, ...(password ? { passwordHash: await hashPassword(password) } : {}) } });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "User saved." };
  });
}

export async function deleteUser(id: string): Promise<ActionResult> {
  return guarded(async () => {
    const me = await assertAdmin();
    if (!ID.test(id)) return { ok: false, error: "Unknown user." };
    if (id === me.id) return { ok: false, error: "You can't delete your own account." };
    const user = await prisma.user.findUnique({ where: { id }, select: { role: true, status: true } });
    if (!user) return { ok: false, error: "This user was already deleted." };
    if (user.role === "admin" && user.status === "active" && !(await anotherAdmin(id))) return { ok: false, error: "At least one active admin must remain." };
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "User deleted." };
  });
}

// ---------- Categories ----------

/** Moves every game from one genre to another (genres are fixed keys with translations in the dictionaries). */
export async function reassignGenre(from: string, to: string): Promise<ActionResult> {
  return guarded(async () => {
    const names: string[] = GENRES.map((g) => g.name);
    if (typeof from !== "string" || typeof to !== "string" || !names.includes(to) || from === to || from.length > 60) return { ok: false, error: "Choose two different genres." };
    const games = await prisma.game.findMany({ where: { genres: { has: from } }, select: { id: true, genres: true } });
    await prisma.$transaction(games.map((g) => prisma.game.update({ where: { id: g.id }, data: { genres: [...new Set(g.genres.map((x) => (x === from ? to : x)))] } })));
    refresh();
    return { ok: true, message: `${games.length} game${games.length === 1 ? "" : "s"} moved to ${to}.` };
  });
}

