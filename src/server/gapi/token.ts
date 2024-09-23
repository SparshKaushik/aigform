import { eq } from "drizzle-orm";
import { db } from "../db";
import { accounts } from "../db/schema";
import axios from "axios";
import { env } from "~/env";

type TokenResponse = {
  access_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
};

async function getToken(refreshToken: string) {
  console.log("getToken", refreshToken);
  const resp = await axios.post("https://oauth2.googleapis.com/token", {
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });
  return resp.data as TokenResponse;
}

export async function getUserToken(id: string) {
  const users = await db.select().from(accounts).where(eq(accounts.userId, id));
  if (users.length === 0) return null;
  const user = users[0];
  if ((Number(`${user?.expires_at}000`) ?? 0) + 1000 * 60 * 2 > Date.now())
    return user?.access_token;
  const token = await getToken(user?.refresh_token ?? "");
  await db
    .update(accounts)
    .set({
      access_token: token.access_token,
      expires_at: Date.now() + 1000 * token.expires_in,
    })
    .where(eq(accounts.userId, id));
  return token.access_token;
}
