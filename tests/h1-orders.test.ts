/**
 * Security tests for placing orders (audit item H1): lib/orders.ts and the checkout schema.
 * Run: npm test (node:test through tsx; .env's DATABASE_URL).
 *
 * The project has one database, so these tests touch only what they create and remove it at the end:
 * orders for h1-<run>-…-test@example.com, one temporary user, and rate-limit counters under their own
 * scope ("order-test-<run>", so the shop's counters, including its overall ceiling, are never used).
 * The catalogue is only read. Telegram is never called: notifications go to a stand-in.
 */
import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import { ipKey, orderRules } from "@/lib/auth/rate-limit";
import { priceLines } from "@/lib/cart-pricing";
import { dictionaries } from "@/lib/i18n/dictionaries";
import { notifyOrder, orderIdFor, orderMessage, pendingNotifications, submitOrder, type OrderContext, type OrderRequest } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/schemas";

const RUN = Date.now().toString(36);
const SCOPE = `order-test-${RUN}`;
const mail = (tag: string) => `h1-${RUN}-${tag}-test@example.com`;
let ipSeq = 10;
const ctx = (over: Partial<OrderContext> = {}): OrderContext => ({ ip: `203.0.113.${ipSeq++ % 250}`, userId: null, locale: "ro", currency: "MDL", limitScope: SCOPE, ...over });
const key = (tag: string) => `${RUN}-${tag}-${Math.random().toString(36).slice(2, 10)}`.padEnd(16, "x");

let game: { slug: string; platform: string; stock: number; price: number };
let userId: string;

async function request(over: Partial<OrderRequest> & { tag: string; quantity?: number }): Promise<OrderRequest> {
  const items = over.items ?? [{ slug: game.slug, platform: game.platform, edition: null, quantity: over.quantity ?? 1 }];
  const priced = await priceLines(items);
  const total = Math.round(items.reduce((s, l, i) => s + (priced[i]?.price ?? 0) * l.quantity, 0) * 100) / 100;
  return { name: "H1 Tester", phone: `+373 6${String(ipSeq).padStart(7, "0")}`, email: mail(over.tag), comment: "", items, shownTotal: total, key: key(over.tag), ...over };
}
async function shopCount() {
  const r = (await prisma.$runCommandRaw({ find: "AuthRateLimit", filter: { _id: { $regex: `^${SCOPE}:shop:` } }, projection: { count: 1 } })) as { cursor: { firstBatch: { count: unknown }[] } };
  // Raw results may carry numbers in extended JSON ({ $numberInt: "3" }).
  return r.cursor.firstBatch.reduce((s, d) => s + Number((d.count as { $numberInt?: string })?.$numberInt ?? d.count), 0);
}
const ordersFor = (email: string) => prisma.order.findMany({ where: { email }, select: { id: true, number: true, userId: true, totalMdl: true, items: true, notifiedAt: true, notifyAttempts: true } });

before(async () => {
  // A game sold as one version, with a stock small enough to test the limit (quantities go up to 99).
  const games = await prisma.game.findMany({ where: { stock: { gte: 3, lte: 98 } }, select: { slug: true, platforms: true, stock: true, variants: true, price: true } });
  const g = games.find((x) => x.variants.length === 0 && x.platforms.length > 0);
  assert.ok(g, "needs a game without versions and with 3–98 in stock");
  game = { slug: g.slug, platform: g.platforms[0], stock: g.stock, price: g.price };
  const user = await prisma.user.create({ data: { name: "H1 Tester", email: mail("user"), passwordHash: null, role: "user", status: "active", sessionVersion: 0 }, select: { id: true } });
  userId = user.id;
});

after(async () => {
  const orders = await prisma.order.deleteMany({ where: { email: { startsWith: `h1-${RUN}-`, endsWith: "-test@example.com" } } });
  const users = await prisma.user.deleteMany({ where: { email: mail("user") } });
  // Only this run's own counters (their keys start with its scope), however many there are.
  const counters = (await prisma.$runCommandRaw({ delete: "AuthRateLimit", deletes: [{ q: { _id: { $regex: `^${SCOPE}:` } }, limit: 0 }] })) as { n?: unknown };
  console.log(`cleanup: ${orders.count} orders, ${users.count} user, ${Number(counters.n)} rate-limit counters`);
  await prisma.$disconnect();
});

describe("placing an order", () => {
  test("1–2. a guest order is saved with the catalogue's price and no account", async () => {
    const req = await request({ tag: "guest", quantity: 2 });
    const r = await submitOrder(req, ctx());
    assert.equal(r.ok, true);
    assert.ok(r.ok && r.created && /^IV-[0-9A-Z]+$/.test(r.number));
    const [o] = await ordersFor(req.email);
    assert.equal(o.userId, null);
    assert.equal(o.items[0].unitPrice, (await priceLines(req.items))[0]?.price);
    assert.equal(o.totalMdl, req.shownTotal);
    assert.equal(o.notifiedAt, null);
    assert.equal(o.notifyAttempts, 0);
  });

  test("3. a signed-in order belongs to the session's account", async () => {
    const req = await request({ tag: "member" });
    const r = await submitOrder(req, ctx({ userId }));
    assert.ok(r.ok && r.created);
    const [o] = await ordersFor(req.email);
    assert.equal(o.userId, userId);
  });

  test("4. an unknown game is refused, nothing saved", async () => {
    const req = await request({ tag: "unknown", items: [{ slug: `no-such-game-${RUN}`, platform: "PC", quantity: 1 }], shownTotal: 0 });
    assert.deepEqual(await submitOrder(req, ctx()), { ok: false, reason: "unavailable" });
    assert.equal((await ordersFor(req.email)).length, 0);
  });

  test("5. quantities: the schema accepts only whole 1–99; the server checks stock, lines counted together", async () => {
    const schema = orderSchema(dictionaries.en);
    const base = { name: "Test", phone: "+37360000000", email: "a@example.com", comment: "" };
    for (const quantity of [0, -1, 100, 1.5, "2", null]) {
      assert.equal(schema.safeParse({ ...base, items: [{ slug: "x", quantity }] }).success, false, `quantity ${String(quantity)}`);
    }
    assert.equal(schema.safeParse({ ...base, items: [] }).success, false, "empty cart");
    assert.equal(schema.safeParse({ ...base, items: Array(31).fill({ slug: "x", quantity: 1 }) }).success, false, "31 lines");
    assert.equal(schema.safeParse({ ...base, items: [{ slug: "x", quantity: 1 }], idempotencyKey: "short" }).success, false, "bad key");

    const over = await request({ tag: "stock", quantity: game.stock + 1 });
    assert.deepEqual(await submitOrder(over, ctx()), { ok: false, reason: "stock" });
    const half = Math.ceil((game.stock + 1) / 2);
    const split = await request({ tag: "stock2", items: [{ slug: game.slug, platform: game.platform, edition: null, quantity: half }, { slug: game.slug, platform: game.platform, edition: null, quantity: half }] });
    assert.deepEqual(await submitOrder(split, ctx()), { ok: false, reason: "stock" });
    assert.equal((await ordersFor(over.email)).length + (await ordersFor(split.email)).length, 0);
  });

  test("6. prices from the browser are ignored (stripped by the schema, never read)", async () => {
    const parsed = orderSchema(dictionaries.en).parse({
      name: "Test",
      phone: "+37360000000",
      email: mail("price"),
      comment: "",
      items: [{ slug: game.slug, platform: game.platform, quantity: 1, price: 0.01, unitPrice: 0, sum: 0, discountPrice: 0 }],
    });
    assert.deepEqual(Object.keys(parsed.items[0]).sort(), ["platform", "quantity", "slug"]);
    const req = await request({ tag: "price", items: parsed.items });
    const r = await submitOrder(req, ctx());
    assert.ok(r.ok);
    const [o] = await ordersFor(req.email);
    assert.ok(o.items[0].unitPrice > 0.01 && o.items[0].unitPrice === (await priceLines(parsed.items))[0]?.price);
  });

  test("7. a different total is refused (prices changed), nothing saved", async () => {
    for (const shownTotal of [0, 0.01, -5, Number.NaN, game.price * 1000]) {
      const req = await request({ tag: `total${String(shownTotal).replace(/\W/g, "")}`, shownTotal });
      assert.deepEqual(await submitOrder(req, ctx()), { ok: false, reason: "pricesChanged" });
      assert.equal((await ordersFor(req.email)).length, 0);
    }
  });
});

describe("repeats (idempotency)", () => {
  test("8. the same attempt twice: one order, the same number", async () => {
    const req = await request({ tag: "repeat" });
    const a = await submitOrder(req, ctx());
    const b = await submitOrder(req, ctx());
    assert.ok(a.ok && b.ok && a.created && !b.created && a.number === b.number && a.id === b.id);
    assert.equal((await ordersFor(req.email)).length, 1);
  });

  test("9. the same attempt in parallel: exactly one order", async () => {
    const req = await request({ tag: "parallel" });
    const results = await Promise.all(Array.from({ length: 6 }, () => submitOrder(req, ctx())));
    assert.ok(results.every((r) => r.ok));
    assert.equal(results.filter((r) => r.ok && r.created).length, 1);
    assert.equal(new Set(results.map((r) => r.ok && r.number)).size, 1);
    assert.equal((await ordersFor(req.email)).length, 1);
  });

  test("a key reveals nothing of someone else's order", async () => {
    const req = await request({ tag: "owner" });
    const mine = await submitOrder(req, ctx());
    assert.ok(mine.ok);
    // Same key, another email (a guess or a mistake): refused without the order's number.
    assert.deepEqual(await submitOrder({ ...req, email: mail("intruder") }, ctx()), { ok: false, reason: "failed" });
    // Same key from a signed-in account: a different order id altogether, not the guest's order.
    assert.notEqual(orderIdFor(req.key, userId), orderIdFor(req.key, null));
    const other = await submitOrder(req, ctx({ userId }));
    assert.ok(other.ok && other.created && mine.ok && other.id !== mine.id);
  });
});

describe("rate limits", () => {
  test("10. per email: the 4th order in 15 minutes is refused, from any IP", async () => {
    const results = [];
    for (let i = 0; i < 4; i++) {
      const req = await request({ tag: "limit", phone: `+3736100000${i}` });
      results.push((await submitOrder(req, ctx())).ok);
    }
    assert.deepEqual(results, [true, true, true, false]);
    // A sender who is already stopped keeps trying: the shop's overall ceiling doesn't move.
    const before = await shopCount();
    for (let i = 0; i < 5; i++) {
      const again = await request({ tag: "limit", phone: `+3736199999${i}` });
      assert.deepEqual(await submitOrder(again, ctx()), { ok: false, reason: "tooMany" });
    }
    assert.equal(await shopCount(), before, "refused senders don't use up the shop's ceiling");
  });

  test("10. per IP: the 6th order from one IP is refused, whatever the email", async () => {
    const ip = "203.0.113.251";
    const ok = [];
    for (let i = 0; i < 6; i++) ok.push((await submitOrder(await request({ tag: `ip${i}` }), ctx({ ip }))).ok);
    assert.deepEqual(ok, [true, true, true, true, true, false]);
  });

  test("IPv6 addresses are limited by their /64", () => {
    assert.equal(ipKey("2001:db8:1:2:aaaa:bbbb:cccc:dddd"), ipKey("2001:db8:1:2::1"));
    assert.notEqual(ipKey("2001:db8:1:2::1"), ipKey("2001:db8:1:3::1"));
    assert.equal(ipKey("::ffff:203.0.113.7"), "203.0.113.7");
    const keys = orderRules({ ip: "203.0.113.7", email: "A@Example.com", phone: "+373 60 000 000", userId: null }).map((r) => r.key);
    assert.ok(keys.every((k) => !k.includes("Example.com") && !k.includes("60 000")), "emails and phones are stored hashed");
  });
});

describe("the shop's notification", () => {
  test("11. Telegram success: sent once, marked, never resent", async () => {
    const req = await request({ tag: "tg-ok", name: "<b>Robert</b> & co" });
    const r = await submitOrder(req, ctx());
    assert.ok(r.ok);
    const sent: string[] = [];
    assert.equal(await notifyOrder(r.id, async (html) => void sent.push(html)), "sent");
    assert.equal(await notifyOrder(r.id, async (html) => void sent.push(html)), "skipped");
    assert.equal(sent.length, 1);
    assert.ok(sent[0].includes("&lt;b&gt;Robert&lt;/b&gt; &amp; co") && !sent[0].includes("<b>Robert"), "customer text is escaped");
    assert.ok(sent[0].includes(r.number));
    const [o] = await ordersFor(req.email);
    assert.ok(o.notifiedAt instanceof Date);
    assert.equal(o.notifyAttempts, 1);
  });

  test("12–13. Telegram failure: the order stays, pending, and can be sent later", async () => {
    const req = await request({ tag: "tg-down" });
    const r = await submitOrder(req, ctx());
    assert.ok(r.ok);
    assert.equal(await notifyOrder(r.id, async () => { throw new Error("Telegram sendMessage failed: 502"); }), "failed");
    const [o] = await ordersFor(req.email);
    assert.ok(o, "the order still exists");
    assert.equal(o.notifiedAt, null);
    assert.equal(o.notifyAttempts, 1);
    assert.ok((await pendingNotifications(500)).some((p) => p.id === r.id), "listed as pending");
    assert.equal(await notifyOrder(r.id, async () => {}), "sent");
    assert.ok(!(await pendingNotifications(500)).some((p) => p.id === r.id));
  });

  test("two senders at once: one message", async () => {
    const r = await submitOrder(await request({ tag: "tg-race" }), ctx());
    assert.ok(r.ok);
    let sends = 0;
    const slow = async () => {
      sends++;
      await new Promise((ok) => setTimeout(ok, 200));
    };
    const outcomes = await Promise.all([notifyOrder(r.id, slow), notifyOrder(r.id, slow), notifyOrder(r.id, slow)]);
    assert.equal(sends, 1);
    assert.deepEqual(outcomes.sort(), ["sent", "skipped", "skipped"]);
  });

  test("orders from before tracking are never re-announced", async () => {
    const legacy = await prisma.order.create({
      data: { number: `IV-H1${RUN.toUpperCase()}`, name: "Legacy", email: mail("legacy"), phone: "+37360000000", items: [], totalMdl: 1, currency: "MDL", locale: "ro" },
      select: { id: true },
    });
    assert.equal(await notifyOrder(legacy.id, async () => assert.fail("must not send")), "skipped");
    assert.ok(!(await pendingNotifications(500)).some((p) => p.id === legacy.id));
  });

  test("the message is built from the saved order", async () => {
    const html = orderMessage({ number: "IV-X", items: [{ slug: "s", title: "T<i>", platform: "PC", edition: null, quantity: 2, unitPrice: 10, sum: 20 }], totalMdl: 20, currency: "EUR", name: "N", phone: "+1", email: "e@example.com", comment: "<script>", locale: "ru", createdAt: new Date() });
    assert.ok(html.includes("T&lt;i&gt;") && html.includes("&lt;script&gt;") && html.includes("Total:") && html.includes("Valuta: EUR"));
  });
});
