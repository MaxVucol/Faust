import { HONEYPOT_FIELD } from "@/lib/schemas";

/**
 * Anti-spam field: invisible, skipped by Tab and hidden from screen readers, so people never fill it.
 * Bots that fill every input do, and the server drops their submission (app/actions.ts).
 */
export function Honeypot() {
  return (
    <div aria-hidden className="sr-only">
      <label>
        Website
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
