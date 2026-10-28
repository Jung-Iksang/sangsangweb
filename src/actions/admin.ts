"use server";

import { eq } from "drizzle-orm";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { BOARD_TYPES, gallery, posts, type BoardType } from "@/db/schema";
import { authConfigProblems, endSession, isLockedOut, requireAdmin, startSession, verifyCredentials } from "@/lib/auth";
import { firstImageSrc, makeExcerpt, sanitizePostHtml } from "@/lib/html";
import { deleteObject, isSafeKey, keyFromUrl, publicUrlForKey } from "@/lib/storage";

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

// ───────── 갤러리 ─────────
export async function addGalleryItems(
  items: { title: string; key: string; width: number; height: number }[],
): Promise<ActionResult<{ count: number }>> {
  await requireAdmin();
  const valid = items.filter((it) => isSafeKey(it.key) && it.key.startsWith("gallery/"));
  if (!valid.length) return { ok: false, error: "업로드된 사진이 없습니다." };
  const db = await getDb();
  await db.insert(gallery).values(
    valid.map((it) => ({
      title: it.title.trim().slice(0, 200) || "활동 사진",
      imageUrl: publicUrlForKey(it.key),
      storageKey: it.key,
      width: Math.max(1, Math.round(it.width)) || 1200,
      height: Math.max(1, Math.round(it.height)) || 900,
    })),
  );
  updateTag("gallery");
  return { ok: true, data: { count: valid.length } };
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
  const [row] = await db.delete(gallery).where(eq(gallery.id, id)).returning({ key: gallery.storageKey });
  if (row?.key) await deleteObject(row.key);
  updateTag("gallery");
  return { ok: true };
}
