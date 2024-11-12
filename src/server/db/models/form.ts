"use server";

import { inArray } from "drizzle-orm";
import { db } from "..";
import { formChat, type formChatType, formChatTypeInsert, forms as formsDB } from "../schema";
import { auth } from "~/server/auth";

export async function importForms(
  forms: {
    id: string;
    name: string;
  }[],
) {
  const user = (await auth())?.user?.id;
  if (!user) return;
  const existingForms = await db
    .select()
    .from(formsDB)
    .where(
      inArray(
        formsDB.id,
        forms.map((f) => f.id),
      ),
    );

  return Promise.all(
    forms
      .filter((f) => !existingForms.find((ef) => ef.id === f.id))
      .map(async (form) => {
        await db.insert(formsDB).values({
          id: form.id,
          name: form.name,
          createdById: user,
        });
      }),
  );
}

export async function removeForms(forms: string[]) {
  return await db.delete(formsDB).where(inArray(formsDB.id, forms));
}

export async function updateFormChat(message: formChatTypeInsert) {
  await db.insert(formChat).values(message);
}
