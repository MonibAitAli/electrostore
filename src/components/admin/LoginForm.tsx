"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { fr } from "@/i18n/fr";
import { AdminError, Field, TextInput } from "./Fields";
import { SubmitButton } from "./SubmitButton";

export function LoginForm() {
  const [state, formAction] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <AdminError state={state} />
      <Field label={fr["admin.password"]}>
        <TextInput name="password" required />
      </Field>
      <SubmitButton className="w-full bg-rouge text-white hover:bg-rouge-fonce" pendingLabel="…">
        {fr["admin.login"]}
      </SubmitButton>
    </form>
  );
}