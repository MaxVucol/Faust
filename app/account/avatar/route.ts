import { getSessionUser } from "@/lib/auth/user";
import { prisma } from "@/lib/prisma";

/**
 * The signed-in user's own profile picture (there is no id in the URL: the session decides whose).
 * The account page links it with ?v=<last change>, so a new picture is a new URL and the old one can be
 * cached by the browser alone (private). Served as an inert image: no sniffing, no scripts.
 */
export async function GET() {
  const user = await getSessionUser();
  if (!user) return new Response(null, { status: 401, headers: { "Cache-Control": "no-store" } });
  const avatar = await prisma.avatar.findUnique({ where: { id: user.id }, select: { data: true, type: true } });
  if (!avatar) return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  return new Response(new Uint8Array(avatar.data), {
    headers: {
      "Content-Type": avatar.type,
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "Content-Disposition": 'inline; filename="avatar"',
    },
  });
}
