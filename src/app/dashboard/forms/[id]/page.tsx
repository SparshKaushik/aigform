import { getForm } from "~/server/gapi/form";

export default async function FormID({ params }: { params: { id: string } }) {
  const form = await getForm(params.id);
  return <pre>{JSON.stringify(form.data, null, 2)}</pre>;
}
