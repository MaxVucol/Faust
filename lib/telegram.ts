import "server-only";

/**
 * Sends a message to the shop's Telegram chat through the Bot API. The bot token and the chat id come
 * only from the environment (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID; see .env.example) and are never
 * logged or sent to the browser.
 */
export async function sendTelegramMessage(html: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) throw new Error("Telegram is not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID)");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: "HTML", disable_web_page_preview: true }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) {
    // Telegram's own error text (e.g. "chat not found"); it never contains the token.
    const detail = await res.json().then((j: { description?: string }) => j.description).catch(() => "");
    throw new Error(`Telegram sendMessage failed: ${res.status} ${detail ?? ""}`.trim());
  }
}

/** Escapes text for Telegram's HTML parse mode. */
export function escapeTelegramHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
