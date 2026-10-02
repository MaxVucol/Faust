/**
 * Where to go after signing in or registering: only a path on this site. Anything else (an absolute
 * URL, a protocol-relative "//host", a backslash trick, control characters, or a way back to the sign-in
 * pages themselves) falls back to `fallback`.
 */
const LOCAL_PATH = /^\/(?![/\\])[A-Za-z0-9\-._~/?=&%+]*$/;

export function safeNext(value: unknown, fallback = "/account"): string {
  if (typeof value !== "string" || value.length > 300 || !LOCAL_PATH.test(value)) return fallback;
  if (/^\/(login|register)(?:[/?]|$)/.test(value)) return fallback;
  return value;
}
