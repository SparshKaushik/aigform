"use server";

import formsapi from "./axios";

export async function getForm(formId: string) {
  return await formsapi.get(`/forms/${formId}`);
}
