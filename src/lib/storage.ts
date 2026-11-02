import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * 이미지 저장소
 * - BLOB_READ_WRITE_TOKEN 이 있으면(Vercel): 브라우저 → Vercel Blob 직접 업로드(client upload, 토큰은 /api/admin/upload 가 발급)
 *   Vercel 서버 함수는 요청 본문 4.5MB 제한이 있어 서버를 거치지 않는다. 공개 URL 은 *.public.blob.vercel-storage.com
 * - 없으면(로컬 개발): .data/uploads 에 저장, /uploads/* 로 서빙
 *
 * DB 에는 imageUrl(표시용) 과 storageKey(삭제용) 를 함께 저장한다.
 * storageKey 는 Blob 이면 Blob URL, 로컬이면 folder/YYYY/MM/uuid.ext 키.
 */
export const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB (브라우저에서 리사이즈 후 업로드)
export const UPLOAD_FOLDERS = ["gallery", "posts"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const LOCAL_UPLOAD_DIR = path.join(process.cwd(), ".data", "uploads");

export function isBlobConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function newKey(folder: UploadFolder, contentType: string) {
  const ext = ALLOWED_TYPES[contentType];
  const d = new Date();
  const ym = `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  return `${folder}/${ym}/${randomUUID()}.${ext}`;
}

/** 키 검증: folder/YYYY/MM/uuid.ext 형식만 허용 (경로 조작 방지) */
export function isSafeKey(key: string) {
  return /^(gallery|posts)\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|gif)$/.test(key);
}

/** Vercel Blob 공개 URL 인지 */
export function isBlobUrl(url: string) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export type StoredImage = { imageUrl: string; storageKey: string };

/**
 * 브라우저가 올린 결과({ key, url })를 DB 에 저장할 값으로 바꾼다. 검증 실패 시 null.
 * - Blob: url 이 우리 Blob 호스트이고 경로가 key 와 같아야 함 (다른 곳의 URL 을 끼워 넣지 못하게)
 * - 로컬: url 은 무시하고 키로 /uploads 경로를 만든다
 */
export function resolveUpload(input: { key?: unknown; url?: unknown }): StoredImage | null {
  const key = input.key;
  if (typeof key !== "string" || !isSafeKey(key)) return null;
  if (isBlobConfigured()) {
    const url = input.url;
    if (typeof url !== "string" || !isBlobUrl(url) || new URL(url).pathname !== `/${key}`) return null;
    return { imageUrl: url, storageKey: url };
  }
  return { imageUrl: `/uploads/${key}`, storageKey: key };
}

export async function writeLocalObject(key: string, data: Uint8Array) {
  const file = path.join(LOCAL_UPLOAD_DIR, key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
}

/** 저장소에서 삭제 — storageKey(Blob URL 또는 로컬 키). 실패해도 DB 삭제는 진행 */
export async function deleteObject(ref: string | null | undefined) {
  if (!ref) return;
  try {
    if (isBlobUrl(ref)) {
      if (!isBlobConfigured()) return;
      const { del } = await import("@vercel/blob");
      await del(ref);
    } else if (isSafeKey(ref)) {
      await unlink(path.join(LOCAL_UPLOAD_DIR, ref));
    }
  } catch (err) {
    console.error("[storage] delete failed", ref, err);
  }
}

/** 본문 <img src> → storageKey (게시글 저장·삭제 시 안 쓰는 이미지 정리용). 우리 저장소 것이 아니면 null */
export function keyFromUrl(url: string) {
  if (isBlobUrl(url)) return url;
  const m = url.match(/^\/uploads\/((?:gallery|posts)\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(?:jpg|png|webp|gif))$/);
  return m?.[1] ?? null;
}
