"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { type Form } from "../db/models/form.type";
import { type BatchUpdateFormRequest } from "../db/models/form.zod";
import gapi from "./axios";
import { forms } from "../db/schema";

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

export async function createForm() {
  return (
    await gapi.formsapi.post("/forms", {
      info: {
        title: "Untitled Document",
      },
    })
  ).data as Form;
}


export async function updateForm(
  request: BatchUpdateFormRequest,
  formId: string,
) {
  await db
    .update(forms)
    .set({ updatedAt: new Date() })
    .where(eq(forms.id, formId));
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

type ExtraMaterial = {
  link?: {
    uri: string;
    displayText: string;
  };
  video?: {
    displayText: string;
    youtubeUri: string;
  };
};

type Feedback = {
  text: string;
  material?: ExtraMaterial[];
};

export type FormResponse = {
  formId: string; // Output only
  responseId: string; // Output only
  createTime: string; // Output only, RFC3339 UTC timestamp
  lastSubmittedTime: string; // Output only, RFC3339 UTC timestamp
  respondentEmail: string; // Output only
  answers: Record<string, {
    questionId: string; // Output only
    grade?: {
      score: number; // Output only
      correct: boolean; // Output only
      feedback?: Feedback; // Output only
    };
    textAnswers?: {
      answers: Array<{
        value: string; // Output only
      }>;
    };
    fileUploadAnswers?: {
      answers: Array<{
        fileId: string; // Output only
        fileName: string; // Output only
        mimeType: string; // Output only
      }>;
    };
  }>;
  totalScore?: number; // Output only
}

export async function getFormResponses(formId: string) {
  return (await gapi.formsapi.get(`/forms/${formId}/responses`)).data as {
    responses: FormResponse[];
  };
}
