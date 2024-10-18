import { getForm } from "~/server/gapi/form";
import { Form } from "./components";

export default async function FormID({ params }: { params: { id: string } }) {
  const form = await getForm(params.id);
  console.log(form);
  return <Form formm={form} />;
}
