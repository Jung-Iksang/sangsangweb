import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { isS3Configured, isSafeKey, MAX_UPLOAD_BYTES, writeLocalObject } from "@/lib/storage";

/** 로컬 개발용 업로드 수신 (S3 설정 시 비활성) */
export async function PUT(request: Request) {
  if (isS3Configured() || process.env.VERCEL) return new NextResponse(null, { status: 404 });
  if (!(await getAdmin())) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  const key = new URL(request.url).searchParams.get("key") ?? "";
  if (!isSafeKey(key)) return NextResponse.json({ error: "잘못된 키" }, { status: 400 });
  const data = new Uint8Array(await request.arrayBuffer());
  if (data.byteLength > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "too large" }, { status: 413 });
  await writeLocalObject(key, data);
  return new NextResponse(null, { status: 200 });
}
