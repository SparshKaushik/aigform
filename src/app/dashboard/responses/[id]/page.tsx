import { getForm, getFormResponses } from "~/server/gapi/form";
import { Form } from "./components";

export default async function FormID({ params }: { params: { id: string } }) {
  const { responses } = await getFormResponses(params.id);
  const form = await getForm(params.id);
  return <Form responses={responses} form={form} />;
}
