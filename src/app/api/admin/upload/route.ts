import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { ALLOWED_TYPES, isBlobConfigured, isSafeKey, MAX_UPLOAD_BYTES, newKey, UPLOAD_FOLDERS, type UploadFolder } from "@/lib/storage";

/**
 * 업로드 준비 (관리자 전용)
 * 1) { folder, contentType, size } → 저장 키 발급 + 모드("blob" | "local") 응답
 * 2) Blob 모드: @vercel/blob/client 의 upload() 가 같은 주소로 토큰을 요청 → handleUpload 가 검증 후 발급
 */
export async function POST(request: Request) {
  if (!(await getAdmin())) return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as
    | { contentType?: string; size?: number; folder?: string }
    | HandleUploadBody
    | null;
  if (!body) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });

  // 2) Blob 클라이언트 업로드 토큰 교환
  if ("type" in body) {
    if (!isBlobConfigured()) return NextResponse.json({ error: "저장소가 설정되지 않았습니다." }, { status: 400 });
    try {
      const json = await handleUpload({
        body,
        request,
        onBeforeGenerateToken: async (pathname) => {
          // 키는 1) 에서 우리가 만든 것만 허용 (임의 경로·덮어쓰기 차단)
          if (!isSafeKey(pathname)) throw new Error("잘못된 저장 경로입니다.");
          return {
            allowedContentTypes: Object.keys(ALLOWED_TYPES),
            maximumSizeInBytes: MAX_UPLOAD_BYTES,
            addRandomSuffix: false,
            allowOverwrite: false,
            validUntil: Date.now() + 5 * 60 * 1000,
          };
        },
      });
      return NextResponse.json(json);
    } catch (e) {
      return NextResponse.json({ error: e instanceof Error ? e.message : "업로드 준비에 실패했습니다." }, { status: 400 });
    }
  }

  // 1) 키 발급
  const contentType = body.contentType ?? "";
  const folder = body.folder as UploadFolder;
  if (!ALLOWED_TYPES[contentType]) {
    return NextResponse.json({ error: "JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다." }, { status: 400 });
  }
  if (!UPLOAD_FOLDERS.includes(folder)) return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
  if (!body.size || body.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "이미지는 10MB 이하만 업로드할 수 있습니다." }, { status: 400 });
  }
  const key = newKey(folder, contentType);
  if (isBlobConfigured()) return NextResponse.json({ mode: "blob", key });
  return NextResponse.json({
    mode: "local",
    key,
    uploadUrl: `/api/admin/upload/local?key=${encodeURIComponent(key)}`,
    publicUrl: `/uploads/${key}`,
  });
}
