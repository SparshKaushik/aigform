import { getForm } from "~/server/gapi/form";
import { Form } from "./components";
import { db } from "~/server/db";
import { formChat } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { getShortURLClicksByShortURLId, getShortURLsByFormId } from "~/server/db/models/shorturls";

export default async function FormID({ params }: { params: { id: string } }) {
  const form = await getForm(params.id);
  const chat = await db
    .select()
    .from(formChat)
    .where(eq(formChat.formId, params.id));

  const shortURLs = await getShortURLsByFormId(params.id);
  const clicks = await getShortURLClicksByShortURLId(shortURLs.map((s) => s.id));

  return <Form formm={form} chatMessages={chat} shortURLs={shortURLs} clicks={clicks} />;
}
