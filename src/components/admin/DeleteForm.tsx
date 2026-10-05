"use client";

import { fr } from "@/i18n/fr";
import { SubmitButton } from "./SubmitButton";

/**
 * A bare server-action form. `confirmMessage` makes the browser prompt before
 * the action posts, which is the only guard a destructive delete really gets.
 */
export function DeleteForm({
  id,
  name,
  action,
}: {
  id: number;
  name: string;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const message = fr["admin.confirmDelete"].replace("{name}", name);
        if (!window.confirm(message)) event.preventDefault();
      }}
      className="inline"
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton className="border border-ligne text-rouge hover:bg-rouge hover:text-white">
        {fr["admin.delete"]}
      </SubmitButton>
    </form>
  );
}