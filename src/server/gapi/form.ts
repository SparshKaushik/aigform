"use server";

import { type Form } from "../db/models/form.type";
import gapi from "./axios";

export async function getForm(formId: string) {
  return (await gapi.formsapi.get(`/forms/${formId}`)).data as Form;
}

export async function getForms(formIds: string[]) {
  return Promise.all(
    formIds.map(async (formId) => {
      return (await gapi.formsapi.get(`/forms/${formId}`).catch(() => null))
        ?.data as Form;
    }),
  );
}
