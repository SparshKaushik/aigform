"use server";

import { eq, inArray } from "drizzle-orm";
import { db } from "~/server/db";
import { formURLShort, formURLShortClicks, type formURLShortType, type formURLShortClicksType } from "../schema";

// ShortURL CRUD
export async function createShortURL(data: { formId: string; shortURL: string, responderURI: string }) {
    return await db.insert(formURLShort).values({ id: crypto.randomUUID(), ...data, shortURL: data.shortURL.length > 0 ? data.shortURL : crypto.randomUUID() }).returning();
}

export async function getShortURL(id: string) {
    return await db.select().from(formURLShort).where(eq(formURLShort.id, id));
}

export async function getShortURLByShortURL(shortURL: string) {
    return await db.select().from(formURLShort).where(eq(formURLShort.shortURL, shortURL));
}

export async function getShortURLsByFormId(formId: string) {
    return await db.select().from(formURLShort).where(eq(formURLShort.formId, formId));
}

export async function updateShortURL(id: string, data: Partial<formURLShortType>) {
    return await db.update(formURLShort).set(data).where(eq(formURLShort.id, id)).returning();
}

export async function deleteShortURL(id: string) {
    return await db.delete(formURLShort).where(eq(formURLShort.id, id)).returning();
}

// ShortURL Clicks CRUD
export async function createShortURLClick(data: { id: string; formURLShortId: string; source: string; clickedAt: Date }) {
    return await db.insert(formURLShortClicks).values(data).returning();
}

export async function getShortURLClicksByShortURLId(shortURLIds: string[]) {
    return await db.select().from(formURLShortClicks).where(inArray(formURLShortClicks.formURLShortId, shortURLIds));
}

export async function updateShortURLClick(id: string, data: Partial<formURLShortClicksType>) {
    return await db.update(formURLShortClicks).set(data).where(eq(formURLShortClicks.id, id)).returning();
}

export async function deleteShortURLClick(id: string) {
    return await db.delete(formURLShortClicks).where(eq(formURLShortClicks.id, id)).returning();
}
