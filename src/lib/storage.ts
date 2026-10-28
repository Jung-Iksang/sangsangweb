import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * 이미지 저장소
 * - S3 환경변수가 있으면: 브라우저 → S3 직접 업로드 (presigned PUT URL), CloudFront 로 서빙
 * - 없으면(로컬 개발): .data/uploads 에 저장, /uploads/* 로 서빙
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

export function isS3Configured() {
  return Boolean(
    process.env.S3_BUCKET && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY,
  );
}

async function s3Client() {
  const { S3Client } = await import("@aws-sdk/client-s3");
  return new S3Client({
    region: process.env.AWS_REGION || "ap-northeast-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export function publicUrlForKey(key: string) {
  if (isS3Configured()) {
    const cdn = process.env.NEXT_PUBLIC_CDN_DOMAIN;
    if (cdn) return `https://${cdn}/${key}`;
    const region = process.env.AWS_REGION || "ap-northeast-2";
    return `https://${process.env.S3_BUCKET}.s3.${region}.amazonaws.com/${key}`;
  }
  return `/uploads/${key}`;
}

export function newKey(folder: UploadFolder, contentType: string) {
  const ext = ALLOWED_TYPES[contentType];
  const d = new Date();
  const ym = `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  return `${folder}/${ym}/${randomUUID()}.${ext}`;
}

export type UploadTarget = { key: string; uploadUrl: string; publicUrl: string; headers: Record<string, string> };

export async function createUploadTarget(folder: UploadFolder, contentType: string): Promise<UploadTarget> {
  const key = newKey(folder, contentType);
  const headers = { "Content-Type": contentType };
  if (isS3Configured()) {
    const { PutObjectCommand } = await import("@aws-sdk/client-s3");
    const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");
    const client = await s3Client();
    const uploadUrl = await getSignedUrl(
      client,
      new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key, ContentType: contentType }),
      { expiresIn: 300 },
    );
    return { key, uploadUrl, publicUrl: publicUrlForKey(key), headers };
  }
  return { key, uploadUrl: `/api/admin/upload/local?key=${encodeURIComponent(key)}`, publicUrl: publicUrlForKey(key), headers };
}

/** 로컬 키 검증: folder/YYYY/MM/uuid.ext 형식만 허용 (경로 조작 방지) */
export function isSafeKey(key: string) {
  return /^(gallery|posts)\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(jpg|png|webp|gif)$/.test(key);
}

export async function writeLocalObject(key: string, data: Uint8Array) {
  const file = path.join(LOCAL_UPLOAD_DIR, key);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
}

/** 저장소에서 삭제 (실패해도 DB 삭제는 진행) */
export async function deleteObject(key: string | null | undefined) {
  if (!key || !isSafeKey(key)) return;
  try {
    if (isS3Configured()) {
      const { DeleteObjectCommand } = await import("@aws-sdk/client-s3");
      const client = await s3Client();
      await client.send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key }));
    } else {
      await unlink(path.join(LOCAL_UPLOAD_DIR, key));
    }
  } catch (err) {
    console.error("[storage] delete failed", key, err);
  }
}

/** 공개 URL → 저장소 키 (본문 이미지 정리용) */
export function keyFromUrl(url: string) {
  const m = url.match(/((?:gallery|posts)\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(?:jpg|png|webp|gif))$/);
  return m?.[1] ?? null;
}
