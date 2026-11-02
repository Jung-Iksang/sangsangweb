"use server";

import { asc, eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { BOARD_TYPES, gallery, galleryImages, posts, type BoardType } from "@/db/schema";
import { authConfigProblems, endSession, isLockedOut, requireAdmin, startSession, verifyCredentials } from "@/lib/auth";
import { firstImageSrc, makeExcerpt, sanitizePostHtml } from "@/lib/html";
import { deleteObject, isSafeKey, keyFromUrl, resolveUpload } from "@/lib/storage";
import { careerProgramSlugs } from "@/content/career-programs";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

// ───────── 로그인 ─────────
export async function loginAction(
  _prev: { error?: string; id?: string } | null,
  formData: FormData,
): Promise<{ error?: string; id?: string }> {
  const problems = authConfigProblems();
  if (problems.length) return { error: `관리자 환경변수가 설정되지 않았습니다: ${problems.join(", ")}` };
  if (await isLockedOut()) return { error: "로그인 시도가 너무 많습니다. 10분 후 다시 시도해 주세요." };

  const id = String(formData.get("id") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!id || !password) return { error: "아이디와 비밀번호를 입력해 주세요.", id };
  if (!(await verifyCredentials(id, password))) return { error: "아이디 또는 비밀번호가 올바르지 않습니다.", id };

  await startSession();
  redirect("/admin");
}

export async function logoutAction() {
  await endSession();
  redirect("/admin/login");
}

// ───────── 게시글 ─────────
const imageKeys = (html: string) =>
  new Set([...html.matchAll(/<img[^>]*\bsrc="([^"]+)"/g)].map((m) => keyFromUrl(m[1])).filter((k): k is string => !!k));

export async function savePost(input: {
  id?: number;
  boardType: BoardType;
  title: string;
  content: string;
  isPublished: boolean;
}): Promise<ActionResult<{ id: number }>> {
  await requireAdmin();
  const title = input.title.trim();
  if (!BOARD_TYPES.includes(input.boardType)) return { ok: false, error: "게시판을 선택해 주세요." };
  if (!title) return { ok: false, error: "제목을 입력해 주세요." };
  if (title.length > 200) return { ok: false, error: "제목은 200자 이내로 입력해 주세요." };

  const content = sanitizePostHtml(input.content);
  if (!content.replace(/<[^>]+>/g, "").trim() && !content.includes("<img")) {
    return { ok: false, error: "내용을 입력해 주세요." };
  }
  const values = {
    boardType: input.boardType,
    title,
    content,
    excerpt: makeExcerpt(content, 160),
    thumbnailUrl: firstImageSrc(content),
    isPublished: input.isPublished,
  };

  const db = await getDb();
  let id = input.id;
  if (id) {
    const [old] = await db.select({ content: posts.content }).from(posts).where(eq(posts.id, id));
    if (!old) return { ok: false, error: "글을 찾을 수 없습니다." };
    await db.update(posts).set({ ...values, updatedAt: new Date() }).where(eq(posts.id, id));
    // 본문에서 빠진 이미지는 저장소에서도 정리
    const kept = imageKeys(content);
    await Promise.all([...imageKeys(old.content)].filter((k) => !kept.has(k)).map(deleteObject));
  } else {
    const [row] = await db.insert(posts).values(values).returning({ id: posts.id });
    id = row.id;
  }
  updateTag("posts");
  return { ok: true, data: { id } };
}

export async function setPostPublished(id: number, isPublished: boolean): Promise<ActionResult> {
  await requireAdmin();
  const db = await getDb();
  await db.update(posts).set({ isPublished }).where(eq(posts.id, id));
  updateTag("posts");
  return { ok: true };
}

export async function deletePost(id: number): Promise<ActionResult> {
  await requireAdmin();
  const db = await getDb();
  const [row] = await db.delete(posts).where(eq(posts.id, id)).returning({ content: posts.content });
  if (row) await Promise.all([...imageKeys(row.content)].map(deleteObject));
  updateTag("posts");
  return { ok: true };
}

// ───────── 갤러리 (앨범: 대표 사진 = gallery 행, 나머지 = gallery_images) ─────────
/** 브라우저 업로드 결과 (key = 저장 경로, url = 공개 URL) */
type UploadedImage = { key: string; url: string; width: number; height: number };
/** 앨범 편집 시 사진 지정: 새로 올린 사진은 key+url, 이미 있던 사진은 url 만 (키 없는 예시 사진 포함) */
export type AlbumImageRef = { key?: string | null; url?: string; width: number; height: number };

const isGalleryKey = (key: unknown): key is string => typeof key === "string" && isSafeKey(key) && key.startsWith("gallery/");
const dims = (it: { width: number; height: number }) => ({
  width: Math.max(1, Math.round(it.width)) || 1200,
  height: Math.max(1, Math.round(it.height)) || 900,
});
type ResolvedImage = { imageUrl: string; storageKey: string | null; width: number; height: number };
/** 연결 프로그램: 진로·직업체험 프로그램 slug 만 허용, 그 밖의 값은 연결 없음 */
const programSlugOf = (v: unknown) => (typeof v === "string" && careerProgramSlugs.has(v) ? v : null);

/** 대표 사진을 gallery 행에, 나머지를 gallery_images 에 순서대로 기록 (neon-http 는 트랜잭션이 없어 순차 실행) */
async function writeAlbumImages(id: number, images: ResolvedImage[]) {
  const db = await getDb();
  const [cover, ...rest] = images;
  await db.update(gallery).set(cover).where(eq(gallery.id, id));
  await db.delete(galleryImages).where(eq(galleryImages.galleryId, id));
  if (rest.length) await db.insert(galleryImages).values(rest.map((im, i) => ({ ...im, galleryId: id, sortOrder: i })));
}

export async function createGalleryAlbum(input: {
  title: string;
  description: string;
  programSlug?: string | null;
  images: UploadedImage[];
}): Promise<ActionResult<{ id: number }>> {
  await requireAdmin();
  const title = input.title.trim();
  if (!title) return { ok: false, error: "앨범 제목을 입력해 주세요." };
  const images: ResolvedImage[] = [];
  for (const it of input.images) {
    const stored = isGalleryKey(it.key) ? resolveUpload(it) : null;
    if (stored) images.push({ ...stored, ...dims(it) });
  }
  if (!images.length) return { ok: false, error: "업로드된 사진이 없습니다." };
  const db = await getDb();
  const [row] = await db
    .insert(gallery)
    .values({ title: title.slice(0, 200), description: input.description.trim().slice(0, 500), programSlug: programSlugOf(input.programSlug), ...images[0] })
    .returning({ id: gallery.id });
  try {
    await writeAlbumImages(row.id, images);
  } catch {
    await db.delete(gallery).where(eq(gallery.id, row.id));
    await Promise.all(images.map((im) => deleteObject(im.storageKey)));
    return { ok: false, error: "앨범 저장 중 오류가 났습니다. 다시 시도해 주세요." };
  }
  updateTag("gallery");
  return { ok: true, data: { id: row.id } };
}

/** 앨범 제목·설명·사진 구성(추가·삭제·순서·대표)을 한 번에 저장 */
export async function saveGalleryAlbum(
  id: number,
  input: { title: string; description: string; programSlug?: string | null; images: AlbumImageRef[] },
): Promise<ActionResult> {
  await requireAdmin();
  const title = input.title.trim();
  if (!title) return { ok: false, error: "앨범 제목을 입력해 주세요." };
  const db = await getDb();
  const [album] = await db.select().from(gallery).where(eq(gallery.id, id));
  if (!album) return { ok: false, error: "앨범을 찾을 수 없습니다." };
  const extras = await db.select().from(galleryImages).where(eq(galleryImages.galleryId, id)).orderBy(asc(galleryImages.sortOrder));
  const current: ResolvedImage[] = [
    { imageUrl: album.imageUrl, storageKey: album.storageKey, width: album.width, height: album.height },
    ...extras.map(({ imageUrl, storageKey, width, height }) => ({ imageUrl, storageKey, width, height })),
  ];
  const byUrl = new Map(current.map((im) => [im.imageUrl, im]));

  // 새 사진은 안전한 키만, 기존 사진은 이 앨범에 실제로 있던 URL 만 허용
  const images: ResolvedImage[] = [];
  for (const it of input.images) {
    const stored = isGalleryKey(it.key) ? resolveUpload(it) : null;
    if (stored) images.push({ ...stored, ...dims(it) });
    else if (it.url && byUrl.has(it.url)) images.push(byUrl.get(it.url)!);
  }
  if (!images.length) return { ok: false, error: "앨범에는 사진이 한 장 이상 있어야 합니다." };

  await db
    .update(gallery)
    .set({ title: title.slice(0, 200), description: input.description.trim().slice(0, 500), programSlug: programSlugOf(input.programSlug) })
    .where(eq(gallery.id, id));
  await writeAlbumImages(id, images);
  const kept = new Set(images.map((im) => im.storageKey));
  await Promise.all(current.filter((im) => im.storageKey && !kept.has(im.storageKey)).map((im) => deleteObject(im.storageKey)));
  updateTag("gallery");
  return { ok: true };
}

export async function updateGalleryItem(id: number, input: { title: string; description: string }): Promise<ActionResult> {
  await requireAdmin();
  const title = input.title.trim();
  if (!title) return { ok: false, error: "제목을 입력해 주세요." };
  const db = await getDb();
  await db
    .update(gallery)
    .set({ title: title.slice(0, 200), description: input.description.trim().slice(0, 500) })
    .where(eq(gallery.id, id));
  updateTag("gallery");
  return { ok: true };
}

export async function deleteGalleryItem(id: number): Promise<ActionResult> {
  await requireAdmin();
  const db = await getDb();
  const extras = await db.select({ key: galleryImages.storageKey }).from(galleryImages).where(eq(galleryImages.galleryId, id));
  // gallery_images 행은 ON DELETE CASCADE 로 함께 삭제됨
  const [row] = await db.delete(gallery).where(eq(gallery.id, id)).returning({ key: gallery.storageKey });
  if (row) await Promise.all([row.key, ...extras.map((e) => e.key)].map((k) => deleteObject(k)));
  updateTag("gallery");
  return { ok: true };
}
