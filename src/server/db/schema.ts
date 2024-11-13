import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccountType } from "next-auth/adapters";

export const forms = pgTable(
  "form",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    previewImage: text("previewImage").default("https://placehold.co/200x150"),
    createdById: varchar("createdById", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }),
  },
  (example) => ({
    idIndex: index("id_idx").on(example.id),
    nameIndex: index("name_idx").on(example.name),
    createdByIdIdx: index("createdById_idx").on(example.createdById),
  }),
);

export const formURLShort = pgTable("formURLShort", {
  id: text("id").primaryKey(),
  formId: text("formId").notNull().references(() => forms.id),
  shortURL: text("shortURL").notNull().unique(),
  responderURI: text("responderURI").notNull(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }),
  createdAt: timestamp("createdAt", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type formURLShortType = typeof formURLShort.$inferSelect;
export type formURLShortTypeInsert = typeof formURLShort.$inferInsert;

export const formURLShortClicks = pgTable("formURLShortClicks", {
  id: text("id").primaryKey(),
  formURLShortId: text("formURLShortId").notNull().references(() => formURLShort.id),
  source: text("source").notNull(),
  clickedAt: timestamp("clickedAt", { withTimezone: true }).notNull(),
});

export type formURLShortClicksType = typeof formURLShortClicks.$inferSelect;
export type formURLShortClicksTypeInsert = typeof formURLShortClicks.$inferInsert;

export const aiRole = pgEnum("aiRole", ["user", "assistant"]);

export const formChat = pgTable(
  "formChat",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    formId: text("formId").notNull().references(() => forms.id),
    role: text("roles").notNull(),
    message: text("message").notNull(),
    createdAt: timestamp("createdAt", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (example) => ({
    formIdIdx: index("formId_idx").on(example.formId),
  }),
);

export type formChatType = typeof formChat.$inferSelect
export type formChatTypeInsert = typeof formChat.$inferInsert

export const gaccessTypeEnum = pgEnum("gaccessType", ["basic", "full"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  gaccessType: gaccessTypeEnum("gaccessType"),
});

export const userids = pgTable("userids", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  }),
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
);
