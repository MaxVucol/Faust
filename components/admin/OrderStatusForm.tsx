"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/admin/actions";
import { Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useAdminI18n } from "./AdminI18n";
import { btn, Notice } from "./ui";

const STATUSES = ["new", "processing", "completed", "cancelled"];
const PAYMENTS = ["unpaid", "paid", "refunded"];

export function OrderStatusForm({ id, status, paymentStatus }: { id: string; status: string; paymentStatus: string }) {
  const { t } = useAdminI18n();
  const router = useRouter();
  const [values, setValues] = useState({ status, paymentStatus });
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const changed = values.status !== status || values.paymentStatus !== paymentStatus;
  return (
    <form
      className="space-y-4 px-5 py-4"
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await updateOrderStatus({ id, ...values });
          setMessage(r.ok ? { tone: "success", text: r.message ?? t.common.notices.saved } : { tone: "error", text: r.error });
          if (r.ok) router.refresh();
        });
      }}
    >
      <div>
        <Label htmlFor="order-status">{t.order.orderStatus}</Label>
        <Select id="order-status" value={values.status} disabled={pending} onChange={(e) => setValues((v) => ({ ...v, status: e.target.value }))}>
          {STATUSES.map((s) => <option key={s} value={s}>{t.status.order[s] ?? s}</option>)}
        </Select>
      </div>
      <div>
        <Label htmlFor="payment-status">{t.order.paymentStatus}</Label>
        <Select id="payment-status" value={values.paymentStatus} disabled={pending} onChange={(e) => setValues((v) => ({ ...v, paymentStatus: e.target.value }))}>
          {PAYMENTS.map((s) => <option key={s} value={s}>{t.status.payment[s] ?? s}</option>)}
        </Select>
      </div>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <button type="submit" disabled={pending || !changed} className={btn("primary", "md", "w-full")}>
        {pending ? t.common.saving : t.order.update}
      </button>
    </form>
  );
}
