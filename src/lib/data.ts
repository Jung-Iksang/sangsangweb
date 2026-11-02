import "server-only";
import { and, count, desc, eq, gt, inArray, lt, asc, sql } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";
import { getDb } from "@/db";
import { gallery, galleryImages, posts, type BoardType } from "@/db/schema";
import { isRecent } from "./format";
import { programsByTheme, type CareerThemeSlug } from "@/content/career-programs";

/**
 * 공개 페이지용 데이터 (캐시됨).
 * 관리자가 글/사진을 저장하면 actions 에서 updateTag("posts" | "gallery") 로 즉시 갱신된다.
 * cacheLife("hours") 는 "새 글" 배지·조회수 표시를 위한 주기적 갱신용 (조회수는 최대 1시간 늦게 보임).
 */

export type PostSummary = {
  id: number;
  boardType: BoardType;
  title: string;
  excerpt: string;
  thumbnailUrl: string | null;
  views: number;
  createdAt: string;
  isNew: boolean;
};

export type PostDetail = PostSummary & {
  content: string;
  updatedAt: string;
  prev: { id: number; title: string } | null;
  next: { id: number; title: string } | null;
};

export type GalleryCard = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  width: number;
  height: number;
  /** 앨범 사진 수 (대표 사진 포함) */
  imageCount: number;
  /** 연결된 진로·직업체험 프로그램 slug (강사 현장 사진 앨범) */
  programSlug: string | null;
  createdAt: string;
};

export type GalleryImage = { imageUrl: string; width: number; height: number };

const summaryCols = {
  id: posts.id,
  boardType: posts.boardType,
  title: posts.title,
  excerpt: posts.excerpt,
  thumbnailUrl: posts.thumbnailUrl,
  views: posts.views,
  createdAt: posts.createdAt,
};

function toSummary(row: { createdAt: Date } & Omit<PostSummary, "createdAt" | "isNew">, now: number): PostSummary {
  const createdAt = row.createdAt.toISOString();
  return { ...row, createdAt, isNew: isRecent(createdAt, now) };
}

const published = (board: BoardType) => and(eq(posts.boardType, board), eq(posts.isPublished, true));

export const POSTS_PER_PAGE = 10;
export const GALLERY_PER_PAGE = 12;

export async function getLatestPosts(board: BoardType, limit = 5): Promise<PostSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  const db = await getDb();
  const rows = await db.select(summaryCols).from(posts).where(published(board)).orderBy(desc(posts.createdAt)).limit(limit);
  const now = Date.now();
  return rows.map((r) => toSummary(r, now));
}

export async function getPostsPage(board: BoardType, page: number) {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  const db = await getDb();
  const [{ total }] = await db.select({ total: count() }).from(posts).where(published(board));
  const totalPages = Math.max(1, Math.ceil(total / POSTS_PER_PAGE));
  const rows = await db
    .select(summaryCols)
    .from(posts)
    .where(published(board))
    .orderBy(desc(posts.createdAt), desc(posts.id))
    .limit(POSTS_PER_PAGE)
    .offset((page - 1) * POSTS_PER_PAGE);
  const now = Date.now();
  return { items: rows.map((r) => toSummary(r, now)), total, totalPages, page };
}

export async function getPost(board: BoardType, id: number): Promise<PostDetail | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts", `post-${id}`);
  if (!Number.isInteger(id) || id <= 0) return null;
  const db = await getDb();
  const [row] = await db
    .select({ ...summaryCols, content: posts.content, updatedAt: posts.updatedAt })
    .from(posts)
    .where(and(eq(posts.id, id), published(board)));
  if (!row) return null;
  const [prev] = await db
    .select({ id: posts.id, title: posts.title })
    .from(posts)
    .where(and(published(board), lt(posts.createdAt, row.createdAt)))
    .orderBy(desc(posts.createdAt))
    .limit(1);
  const [next] = await db
    .select({ id: posts.id, title: posts.title })
    .from(posts)
    .where(and(published(board), gt(posts.createdAt, row.createdAt)))
    .orderBy(asc(posts.createdAt))
    .limit(1);
  const { updatedAt, content, ...rest } = row;
  return {
    ...toSummary(rest, Date.now()),
    content,
    updatedAt: updatedAt.toISOString(),
    prev: prev ?? null,
    next: next ?? null,
  };
}

/** generateStaticParams · sitemap 용 */
export async function getPostIndex(): Promise<{ id: number; boardType: BoardType; updatedAt: string }[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  const db = await getDb();
  const rows = await db
    .select({ id: posts.id, boardType: posts.boardType, updatedAt: posts.updatedAt })
    .from(posts)
    .where(eq(posts.isPublished, true))
    .orderBy(desc(posts.createdAt));
  return rows.map((r) => ({ ...r, updatedAt: r.updatedAt.toISOString() }));
}

/** RSS 용: 공지·보도자료 최신 글 */
export async function getRecentPostsAll(limit = 30): Promise<PostSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  const db = await getDb();
  const rows = await db.select(summaryCols).from(posts).where(eq(posts.isPublished, true)).orderBy(desc(posts.createdAt)).limit(limit);
  const now = Date.now();
  return rows.map((r) => toSummary(r, now));
}

const galleryCols = {
  id: gallery.id,
  title: gallery.title,
  description: gallery.description,
  imageUrl: gallery.imageUrl,
  width: gallery.width,
  height: gallery.height,
  imageCount: sql<number>`(select count(*) from ${galleryImages} where ${galleryImages.galleryId} = ${gallery.id})::int + 1`,
  programSlug: gallery.programSlug,
  createdAt: gallery.createdAt,
};
const toCard = (r: Omit<GalleryCard, "createdAt"> & { createdAt: Date }): GalleryCard => ({
  ...r,
  createdAt: r.createdAt.toISOString(),
});

export async function getLatestGallery(limit = 10): Promise<GalleryCard[]> {
  "use cache";
  cacheLife("days");
  cacheTag("gallery");
  const db = await getDb();
  const rows = await db.select(galleryCols).from(gallery).orderBy(desc(gallery.createdAt), desc(gallery.id)).limit(limit);
  return rows.map(toCard);
}

export async function getGalleryPage(page: number) {
  "use cache";
  cacheLife("days");
  cacheTag("gallery");
  const db = await getDb();
  const [{ total }] = await db.select({ total: count() }).from(gallery);
  const totalPages = Math.max(1, Math.ceil(total / GALLERY_PER_PAGE));
  const rows = await db
    .select(galleryCols)
    .from(gallery)
    .orderBy(desc(gallery.createdAt), desc(gallery.id))
    .limit(GALLERY_PER_PAGE)
    .offset((page - 1) * GALLERY_PER_PAGE);
  return { items: rows.map(toCard), total, totalPages, page };
}

export async function getGalleryItem(id: number) {
  "use cache";
  cacheLife("days");
  cacheTag("gallery", `gallery-${id}`);
  if (!Number.isInteger(id) || id <= 0) return null;
  const db = await getDb();
  const [row] = await db.select(galleryCols).from(gallery).where(eq(gallery.id, id));
  if (!row) return null;
  const [prev] = await db
    .select({ id: gallery.id, title: gallery.title })
    .from(gallery)
    .where(lt(gallery.createdAt, row.createdAt))
    .orderBy(desc(gallery.createdAt))
    .limit(1);
  const [next] = await db
    .select({ id: gallery.id, title: gallery.title })
    .from(gallery)
    .where(gt(gallery.createdAt, row.createdAt))
    .orderBy(asc(gallery.createdAt))
    .limit(1);
  const extra = await db
    .select({ imageUrl: galleryImages.imageUrl, width: galleryImages.width, height: galleryImages.height })
    .from(galleryImages)
    .where(eq(galleryImages.galleryId, id))
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));
  // 대표 사진(gallery 행) + 나머지 사진(gallery_images) 순서대로
  const images: GalleryImage[] = [{ imageUrl: row.imageUrl, width: row.width, height: row.height }, ...extra];
  return { ...toCard(row), images, prev: prev ?? null, next: next ?? null };
}

export async function getGalleryIndex(): Promise<{ id: number; createdAt: string }[]> {
  "use cache";
  cacheLife("days");
  cacheTag("gallery");
  const db = await getDb();
  const rows = await db.select({ id: gallery.id, createdAt: gallery.createdAt }).from(gallery).orderBy(desc(gallery.createdAt));
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

export type FieldPhoto = GalleryImage & { albumId: number; albumTitle: string; createdAt: string };

/** 프로그램 하나에 보여줄 현장 사진 최대 수 (최신 앨범부터) */
export const FIELD_PHOTOS_PER_PROGRAM = 12;

/**
 * 진로·직업체험 분류 페이지용: 소속 프로그램에 연결된 앨범의 사진을 프로그램별로 최신순 모음.
 * 관리자(강사)가 앨범을 올리면 updateTag("gallery") 로 즉시 반영된다.
 */
export async function getFieldPhotos(theme: CareerThemeSlug): Promise<Record<string, FieldPhoto[]>> {
  "use cache";
  cacheLife("days");
  cacheTag("gallery");
  const slugs = programsByTheme(theme).map((p) => p.slug);
  if (!slugs.length) return {};
  const db = await getDb();
  const albums = await db
    .select({ id: gallery.id, title: gallery.title, programSlug: gallery.programSlug, imageUrl: gallery.imageUrl, width: gallery.width, height: gallery.height, createdAt: gallery.createdAt })
    .from(gallery)
    .where(inArray(gallery.programSlug, slugs))
    .orderBy(desc(gallery.createdAt), desc(gallery.id));
  if (!albums.length) return {};
  const extras = await db
    .select({ galleryId: galleryImages.galleryId, imageUrl: galleryImages.imageUrl, width: galleryImages.width, height: galleryImages.height })
    .from(galleryImages)
    .where(inArray(galleryImages.galleryId, albums.map((a) => a.id)))
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.id));
  const byAlbum = new Map<number, GalleryImage[]>();
  for (const e of extras) {
    const list = byAlbum.get(e.galleryId) ?? [];
    list.push({ imageUrl: e.imageUrl, width: e.width, height: e.height });
    byAlbum.set(e.galleryId, list);
  }
  const out: Record<string, FieldPhoto[]> = {};
  for (const a of albums) {
    const list = (out[a.programSlug!] ??= []);
    const meta = { albumId: a.id, albumTitle: a.title, createdAt: a.createdAt.toISOString() };
    for (const im of [{ imageUrl: a.imageUrl, width: a.width, height: a.height }, ...(byAlbum.get(a.id) ?? [])]) {
      if (list.length < FIELD_PHOTOS_PER_PROGRAM) list.push({ ...im, ...meta });
    }
  }
  return out;
}
