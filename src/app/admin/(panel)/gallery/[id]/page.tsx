import Link from "next/link";
import { notFound } from "next/navigation";
import { AlbumEditor } from "@/components/admin/AlbumEditor";
import { adminGetGalleryAlbum } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/auth";
import { programOptions } from "@/lib/program-options";

// 관리자 화면: 매 요청 서버 렌더링 (DB 최신값 · 로그인 확인)
export const instant = false;

export const metadata = { title: "앨범 사진 관리" };

export default async function EditAlbum({ params }: PageProps<"/admin/gallery/[id]">) {
  await requireAdmin();
  const album = await adminGetGalleryAlbum(Number((await params).id));
  if (!album) notFound();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/gallery" className="text-[14px] text-muted hover:text-ink">‹ 포토갤러리 관리</Link>
          <h1 className="mt-1 text-[26px] font-bold text-ink">앨범 사진 관리</h1>
          <p className="mt-1 text-muted">사진 추가·빼기·순서 변경 후 저장하세요. 첫 번째 사진이 목록·메인에 보이는 대표 사진입니다.</p>
        </div>
        <Link href={`/community/gallery/${album.id}`} target="_blank" className="rounded-btn border border-line bg-white px-4 py-2 text-[14px] hover:border-blue">
          홈페이지에서 보기
        </Link>
      </div>
      <AlbumEditor album={album} programs={programOptions()} />
    </div>
  );
}
