/**
 * Profile pictures. The browser crops and re-encodes the chosen image to a small square (AVATAR_SIZE,
 * components/auth/ProfileDetails.tsx); the server never trusts that and checks the bytes themselves:
 * a real JPEG, PNG or WebP by its signature (not the file name or the declared type), within
 * AVATAR_MAX_BYTES, with dimensions read from the image header. Anything else is refused.
 * The image is stored per user (prisma Avatar, id = user id) and served only to its owner
 * (app/account/avatar/route.ts).
 */

/** What the browser produces: a 256×256 square. */
export const AVATAR_SIZE = 256;
/** The chosen file before it is shrunk in the browser. */
export const AVATAR_SOURCE_MAX_BYTES = 10 * 1024 * 1024;
/** What the server accepts (a 256×256 WebP is usually 15–40 KB). */
export const AVATAR_MAX_BYTES = 256 * 1024;
/** Smallest source image accepted, and the bounds the stored image must stay within. */
export const AVATAR_MIN_SIDE = 64;
const AVATAR_MAX_SIDE = 1024;

export const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type AvatarType = (typeof AVATAR_TYPES)[number];

type Probe = { type: AvatarType; width: number; height: number };

const ascii = (b: Uint8Array, at: number, text: string) => [...text].every((c, i) => b[at + i] === c.charCodeAt(0));
const u16be = (b: Uint8Array, at: number) => (b[at] << 8) | b[at + 1];
const u16le = (b: Uint8Array, at: number) => b[at] | (b[at + 1] << 8);
const u24le = (b: Uint8Array, at: number) => b[at] | (b[at + 1] << 8) | (b[at + 2] << 16);
const u32be = (b: Uint8Array, at: number) => ((b[at] << 24) | (b[at + 1] << 16) | (b[at + 2] << 8) | b[at + 3]) >>> 0;

function png(b: Uint8Array): Probe | null {
  if (b.length < 24 || !(b[0] === 0x89 && ascii(b, 1, "PNG\r\n\x1a\n") && ascii(b, 12, "IHDR"))) return null;
  return { type: "image/png", width: u32be(b, 16), height: u32be(b, 20) };
}

function jpeg(b: Uint8Array): Probe | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8 || b[2] !== 0xff) return null;
  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) return null;
    const marker = b[i + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    const len = u16be(b, i + 2);
    // Start of frame (SOF0–SOF15 except DHT/JPG/DAC) carries height and width.
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      return { type: "image/jpeg", height: u16be(b, i + 5), width: u16be(b, i + 7) };
    }
    if (len < 2) return null;
    i += 2 + len;
  }
  return null;
}

function webp(b: Uint8Array): Probe | null {
  if (b.length < 30 || !ascii(b, 0, "RIFF") || !ascii(b, 8, "WEBP")) return null;
  if (ascii(b, 12, "VP8 ")) return { type: "image/webp", width: u16le(b, 26) & 0x3fff, height: u16le(b, 28) & 0x3fff };
  if (ascii(b, 12, "VP8L") && b[20] === 0x2f) {
    const bits = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
    return { type: "image/webp", width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (ascii(b, 12, "VP8X")) return { type: "image/webp", width: u24le(b, 24) + 1, height: u24le(b, 27) + 1 };
  return null;
}

/**
 * The checked image, or why it was refused: "tooLarge" (bytes), "type" (not a JPEG/PNG/WebP by its
 * content), "invalid" (unreadable header or dimensions outside the accepted bounds).
 */
export function checkAvatar(bytes: Uint8Array): { ok: true; type: AvatarType } | { ok: false; reason: "tooLarge" | "type" | "invalid" } {
  if (bytes.length === 0) return { ok: false, reason: "invalid" };
  if (bytes.length > AVATAR_MAX_BYTES) return { ok: false, reason: "tooLarge" };
  const probe = png(bytes) ?? jpeg(bytes) ?? webp(bytes);
  if (!probe) {
    const known = bytes[0] === 0x89 || (bytes[0] === 0xff && bytes[1] === 0xd8) || ascii(bytes, 0, "RIFF");
    return { ok: false, reason: known ? "invalid" : "type" };
  }
  const sides = [probe.width, probe.height];
  if (sides.some((s) => !Number.isInteger(s) || s < AVATAR_MIN_SIDE || s > AVATAR_MAX_SIDE)) return { ok: false, reason: "invalid" };
  return { ok: true, type: probe.type };
}
