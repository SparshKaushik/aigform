import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import { db } from "./db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "./db/schema";

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
  trustHost: true,
});
