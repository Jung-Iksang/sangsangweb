import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { ALLOWED_TYPES, createUploadTarget, MAX_UPLOAD_BYTES, UPLOAD_FOLDERS, type UploadFolder } from "@/lib/storage";

/** 업로드 대상 URL 발급 (관리자 전용) */
export async function POST(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as { contentType?: string; size?: number; folder?: string } | null;
  const contentType = body?.contentType ?? "";
  const folder = body?.folder as UploadFolder;
  if (!ALLOWED_TYPES[contentType]) {
    return NextResponse.json({ error: "JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다." }, { status: 400 });
  }
  if (!UPLOAD_FOLDERS.includes(folder)) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  if (!body?.size || body.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "이미지는 10MB 이하만 업로드할 수 있습니다." }, { status: 400 });
  }
  const target = await createUploadTarget(folder, contentType);
  return NextResponse.json(target);
}
