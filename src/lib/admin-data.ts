import "server-only";
import { and, count, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { gallery, posts, type BoardType } from "@/db/schema";

/** 관리자 화면용 (캐시 없음 · 비공개 글 포함) */
export const ADMIN_PER_PAGE = 20;

export async function adminStats() {
  const db = await getDb();
  const [[notice], [press], [photos], [views]] = await Promise.all([
    db.select({ n: count() }).from(posts).where(eq(posts.boardType, "notice")),
    db.select({ n: count() }).from(posts).where(eq(posts.boardType, "press")),
    db.select({ n: count() }).from(gallery),
    db.select({ n: posts.views }).from(posts).orderBy(desc(posts.views)).limit(1),
  ]);
  return { notice: notice.n, press: press.n, photos: photos.n, topViews: views?.n ?? 0 };
}

export async function adminRecentPosts(limit = 5) {
  const db = await getDb();
  return db
    .select({ id: posts.id, boardType: posts.boardType, title: posts.title, createdAt: posts.createdAt, views: posts.views, isPublished: posts.isPublished })
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit);
}

export async function adminListPosts(board: BoardType, page: number) {
  const db = await getDb();
  const where = eq(posts.boardType, board);
  const [{ total }] = await db.select({ total: count() }).from(posts).where(where);
  const items = await db
    .select({ id: posts.id, title: posts.title, createdAt: posts.createdAt, views: posts.views, isPublished: posts.isPublished })
    .from(posts)
    .where(where)
    .orderBy(desc(posts.createdAt), desc(posts.id))
    .limit(ADMIN_PER_PAGE)
    .offset((page - 1) * ADMIN_PER_PAGE);
  return { items, total, totalPages: Math.max(1, Math.ceil(total / ADMIN_PER_PAGE)) };
}

export async function adminGetPost(id: number) {
  if (!Number.isInteger(id) || id <= 0) return null;
  const db = await getDb();
  const [row] = await db.select().from(posts).where(and(eq(posts.id, id)));
  return row ?? null;
}

export async function adminListGallery() {
  const db = await getDb();
  return db.select().from(gallery).orderBy(desc(gallery.createdAt), desc(gallery.id));
}
