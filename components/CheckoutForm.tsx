"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { placeOrder } from "@/app/actions";
import { useI18n } from "@/components/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { Honeypot } from "@/components/ui/Honeypot";
import { FieldError, Input, Label, Textarea } from "@/components/ui/Input";
import { Diamond } from "@/components/ui/Ornaments";
import type { CartItem, FormState } from "@/types";

const initial: FormState = { status: "idle" };

function SubmitButton() {
  const { t } = useI18n();
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="gold" disabled={pending} className="min-h-13 w-full text-[0.78rem]">
      {pending ? t.cart.order.sending : t.cart.order.submit}
    </Button>
  );
}

/**
 * The order details, the last step of the cart ledger. Only each line's game, platform, edition and
 * quantity are sent, with the total shown (MDL); the server prices the order from the catalogue and
 * refuses it when that total differs. `onPlaced` runs after a successful submission, `onCartChanged`
 * when prices or availability changed since the cart was priced.
 */
export function CheckoutForm({
  items,
  total,
  onPlaced,
  onCartChanged,
}: {
  items: CartItem[];
  total: number;
  onPlaced: (message: string) => void;
  onCartChanged: () => void;
}) {
  const { t } = useI18n();
  const o = t.cart.order;
  const [state, action] = useActionState(async (prev: FormState, formData: FormData) => {
    const result = await placeOrder(prev, formData);
    if (result.status === "success") onPlaced(result.message ?? "");
    else if (result.code === "cart-changed") onCartChanged();
    return result;
  }, initial);
  // Controlled fields, so what was typed survives a failed submission (React resets uncontrolled ones).
  const [values, setValues] = useState({ name: "", phone: "", email: "", comment: "" });
  const errors = state.fieldErrors ?? {};
  const field = (name: keyof typeof values) => ({
    id: `order-${name}`,
    name,
    value: values[name],
    onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [name]: e.target.value })),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `order-${name}-error` : undefined,
  });
  const lines = items.map(({ slug, platform, edition, quantity }) => ({ slug, platform, edition, quantity }));

  // After a rejected submission, focus the first field marked invalid and bring it to the middle of the
  // screen (clear of the sticky header), so the visitor sees what to fix; the submit button had focus
  // and is disabled while sending, which would otherwise drop focus to the page.
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.status !== "error") return;
    const field = formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']");
    if (!field) return;
    field.focus({ preventScroll: true });
    field.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [state]);

  return (
    <form ref={formRef} action={action} noValidate aria-labelledby="order-title" className="space-y-5">
      <Honeypot />
      <input type="hidden" name="items" value={JSON.stringify(lines)} />
      <input type="hidden" name="total" value={total.toFixed(2)} />
      <div className="border-b border-gold-dark/50 pb-3">
        <h2 id="order-title" className="flex items-center gap-2.5 font-display-ui text-[0.72rem] text-gold-light">
          <Diamond className="size-1.5 bg-gold-dark" />
          {o.title}
        </h2>
      </div>
      <div>
        <Label htmlFor="order-name">{o.name}</Label>
        <Input {...field("name")} autoComplete="name" required />
        <FieldError id="order-name-error" errors={errors.name} />
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
        <div>
          <Label htmlFor="order-phone">{o.phone}</Label>
          <Input {...field("phone")} type="tel" autoComplete="tel" inputMode="tel" required />
          <FieldError id="order-phone-error" errors={errors.phone} />
        </div>
        <div>
          <Label htmlFor="order-email">{o.email}</Label>
          <Input {...field("email")} type="email" autoComplete="email" required />
          <FieldError id="order-email-error" errors={errors.email} />
        </div>
      </div>
      <div>
        <Label htmlFor="order-comment">{o.comment}</Label>
        <Textarea {...field("comment")} maxLength={500} className="min-h-24" />
        <FieldError id="order-comment-error" errors={errors.comment} />
      </div>
      {state.status === "error" && state.message && (
        <p role="alert" className="border-l-2 border-blood-text pl-3 text-base text-blood-text">
          {state.message}
        </p>
      )}
      <div className="pt-1">
        <SubmitButton />
        <p className="mt-3 text-sm text-parchment-muted">{o.note}</p>
      </div>
    </form>
  );
}
