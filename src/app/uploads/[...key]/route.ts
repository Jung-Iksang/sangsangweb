import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isSafeKey, LOCAL_UPLOAD_DIR } from "@/lib/storage";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", gif: "image/gif" };

/** 로컬 개발용 업로드 파일 서빙 (운영에서는 CloudFront URL 사용) */
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[...key]">) {
  const { key: parts } = await ctx.params;
  const key = parts.join("/");
  if (!isSafeKey(key)) return new NextResponse(null, { status: 404 });
  try {
    const data = await readFile(path.join(LOCAL_UPLOAD_DIR, key));
    return new NextResponse(data, {
      headers: {
        "Content-Type": TYPES[key.split(".").pop()!] ?? "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
