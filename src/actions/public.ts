"use server";

import { eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { posts } from "@/db/schema";

export async function incrementViews(id: number) {
  if (!Number.isInteger(id) || id <= 0) return;
  const db = await getDb();
  await db.update(posts).set({ views: sql`${posts.views} + 1` }).where(eq(posts.id, id));
}
