"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { createUser, updateUser } from "@/app/admin/actions";
import { Button } from "@/components/ui/Button";
import { FieldError, Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { createUserSchema, issuesByPath, updateUserSchema } from "@/lib/admin/schemas";
import { Notice } from "./ui";

type Values = { name: string; email: string; role: string; status: string; password: string };

/** Create an account (`id` null) or edit one; a new password is optional when editing. */
export function UserForm({ id, initial }: { id: string | null; initial: Values }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const [pending, start] = useTransition();
  const field = (name: keyof Values) => ({
    id: `user-${name}`,
    value: v[name],
    onChange: (e: { target: { value: string } }) => setV((x) => ({ ...x, [name]: e.target.value })),
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `user-${name}-error` : undefined,
  });
  const err = (name: keyof Values) => (errors[name] ? [errors[name]] : undefined);

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const input = id ? { id, name: v.name, role: v.role, status: v.status, password: v.password } : v;
        const local = (id ? updateUserSchema : createUserSchema).safeParse(input);
        if (!local.success) {
          setErrors(issuesByPath(local.error));
          setMessage({ tone: "error", text: "Check the highlighted fields." });
          return;
        }
        start(async () => {
          const r = id ? await updateUser(input) : await createUser(input);
          if (!r.ok) {
            setErrors(r.fieldErrors ?? {});
            setMessage({ tone: "error", text: r.error });
            return;
          }
          setErrors({});
          if (!id && r.id) {
            router.push(`/admin/users/${r.id}?notice=created`);
            return;
          }
          setV((x) => ({ ...x, password: "" }));
          setMessage({ tone: "success", text: r.message ?? "Saved." });
          router.refresh();
        });
      }}
    >
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <fieldset disabled={pending} className="grid min-w-0 gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="user-name">Name</Label>
          <Input {...field("name")} autoComplete="off" />
          <FieldError id="user-name-error" errors={err("name")} />
        </div>
        <div>
          <Label htmlFor="user-email">Email</Label>
          <Input {...field("email")} type="email" autoComplete="off" readOnly={id !== null} className={id ? "opacity-70" : undefined} />
          <FieldError id="user-email-error" errors={err("email")} />
        </div>
        <div>
          <Label htmlFor="user-role">Role</Label>
          <Select {...field("role")}>
            <option value="admin">admin — full access to this panel</option>
            <option value="user">user — no admin access</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="user-status">Account status</Label>
          <Select {...field("status")}>
            <option value="active">active</option>
            <option value="blocked">blocked — can&apos;t use the panel</option>
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="user-password">{id ? "New password (optional)" : "Password"}</Label>
          <Input {...field("password")} type="password" autoComplete="new-password" />
          <FieldError id="user-password-error" errors={err("password")} />
          {!errors.password && <p className="mt-1.5 text-sm text-parchment-muted">At least 10 characters.{id ? " Leave empty to keep the current one." : ""}</p>}
        </div>
      </fieldset>
      <Button type="submit" variant="gold" size="sm" disabled={pending} className="min-h-11 min-w-40">
        {pending ? "Saving…" : id ? "Save changes" : "Create user"}
      </Button>
    </form>
  );
}
