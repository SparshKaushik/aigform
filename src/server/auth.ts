import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import { db } from "./db";
import {
  accounts,
  sessions,
  userids,
  users,
  verificationTokens,
} from "./db/schema";
import { eq } from "drizzle-orm";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/forms.body.readonly https://www.googleapis.com/auth/forms.responses.readonly https://www.googleapis.com/auth/drive.metadata.readonly",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  events: {
    async createUser({ user }) {
      if (!user.email || !user.id) return;
      const olduser = (
        await db.select().from(userids).where(eq(userids.email, user.email))
      )[0];
      if (olduser) {
        await db
          .update(users)
          .set({ id: olduser.id })
          .where(eq(users.email, user.email));
        return;
      }
      await db.insert(userids).values({ id: user.id, email: user.email });
    },
  },
  trustHost: true,
});
