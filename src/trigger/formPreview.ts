import { schedules } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { type Form } from "~/server/db/models/form.type";
import { forms } from "~/server/db/schema";
import gapi from "~/server/gapi/axios";
import { BrowserApi } from "phantomjscloud";
import { env } from "~/env";
import { getUserToken } from "~/server/gapi/token";

export const firstScheduledTask = schedules.task({
  id: "update-preview-form",

  cron: "* 5 * * *",
  maxDuration: 120,
  run: async (payload, { ctx }) => {
    const cforms = await db
      .select()
      .from(forms)
      .where(eq(forms.previewImage, "https://placehold.co/200x150"));
    if (cforms.length === 0) return;
    for (const form of cforms) {
      if (!form.createdById) continue;
      const token = await getUserToken(form.createdById);
      console.log(token);
      if (!token) continue;
      const formData = (
        await gapi.formsadminapi.get(`/forms/${form.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(() => null)
      )?.data as Form;
      console.log(formData);
      if (!formData || !formData.responderUri) continue;
      // const api = new BrowserApi(env.SCREENSHOT_API_KEY);
      // const userResponse = await api.requestSingle({
      //   url: formData.responderUri,
      // });
      // if (userResponse.statusCode !== 200) continue;
      // const screenshot = userResponse.content.data;
      // if (!screenshot) continue;
      // logger.log(`Updating preview image for ${form.id} to ${screenshot}`);
      // await db.update(forms).set({ previewImage: screenshot }).where(eq(forms.id, form.id));
    }
  },
});
