"use server";

import { type Form } from "../db/models/form.type";
import { type BatchUpdateFormRequest } from "../db/models/form.zod";
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

export async function updateForm(request: BatchUpdateFormRequest, formId: string) {
  return (
    await gapi.formsapi
      .post(`/forms/${formId}:batchUpdate`, {
        requests: request.requests,
        includeFormInResponse: true,
      })
      .catch((e) => {
        console.error(JSON.stringify(e, null, 2));
        return {
          data: {
            error: JSON.stringify(e),
          },
        };
      })
  )?.data as {
    error?: string;
    form?: Form;
  };
}
