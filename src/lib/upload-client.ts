"use client";

/** 관리자 브라우저에서 이미지 리사이즈(최대 2000px, WebP) 후 저장소로 업로드 */
export type Uploaded = { key: string; url: string; width: number; height: number };

const MAX_SIDE = 2000;

async function resize(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  if (file.type === "image/gif") {
    const bmp = await createImageBitmap(file);
    return { blob: file, width: bmp.width, height: bmp.height };
  }
  const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
  const width = Math.round(bmp.width * scale);
  const height = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, width, height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  if (!blob || blob.type !== "image/webp") return { blob: file, width: bmp.width, height: bmp.height };
  return { blob, width, height };
}

export async function uploadImage(file: File, folder: "gallery" | "posts"): Promise<Uploaded> {
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new Error("JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다.");
  const { blob, width, height } = await resize(file);
  const res = await fetch("/api/admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: blob.type, size: blob.size, folder }),
  });
  const target = await res.json();
  if (!res.ok) throw new Error(target.error ?? "업로드 준비에 실패했습니다.");
  const put = await fetch(target.uploadUrl, { method: "PUT", headers: target.headers, body: blob });
  if (!put.ok) throw new Error("이미지 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  return { key: target.key, url: target.publicUrl, width, height };
}
