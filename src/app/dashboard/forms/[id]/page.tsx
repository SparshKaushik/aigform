import { getForm } from "~/server/gapi/form";
import { Form } from "./components";
import { db } from "~/server/db";
import { formChat } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export default async function FormID({ params }: { params: { id: string } }) {
  const form = await getForm(params.id);
  const chat = await db
    .select()
    .from(formChat)
    .where(eq(formChat.formId, params.id));

  return <Form formm={form} chatMessages={chat} />;
}
