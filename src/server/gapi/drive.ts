"use server";

import api from "./axios";

export async function getFormsFromDrive() {
  const response = await api.driveapi.get("/", {
    params: {
      q: "mimeType='application/vnd.google-apps.form'", // Filter for Google Forms
      fields: "files(id, name)", // Adjust fields as needed
    },
  });
  return response.data as {
    files: {
      id: string;
      name: string;
    }[];
  };
}
