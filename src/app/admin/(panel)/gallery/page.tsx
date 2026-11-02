import { adminListGallery } from "@/lib/admin-data";
import { AlbumEditor } from "@/components/admin/AlbumEditor";
import { GalleryItemCard } from "@/components/admin/GalleryItemCard";
import { requireAdmin } from "@/lib/auth";
import { programOptions } from "@/lib/program-options";
import { getCareerProgram } from "@/content/career-programs";

// 관리자 화면: 매 요청 서버 렌더링 (DB 최신값 · 로그인 확인)
export const instant = false;

export const metadata = { title: "포토갤러리 관리" };

export default async function AdminGallery() {
  await requireAdmin();
  const items = await adminListGallery();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[26px] font-bold text-ink">포토갤러리 관리</h1>
        <p className="mt-1 text-muted">앨범 {items.length}개 · 앨범 제목은 검색 결과와 이미지 설명(alt)으로 쓰이니 구체적으로 적어 주세요.</p>
        <p className="mt-1 text-muted">강사 현장 사진은 &lsquo;연결 프로그램&rsquo;을 고르면 진로·직업체험 해당 프로그램 아래에 최신순으로 쌓입니다.</p>
      </div>
      <div>
        <h2 className="mb-3 text-[18px] font-bold text-ink">새 앨범</h2>
        <AlbumEditor programs={programOptions()} />
      </div>
      {items.length === 0 ? (
        <p className="rounded-md bg-white py-16 text-center text-muted border border-line">등록된 앨범이 없습니다.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <GalleryItemCard key={g.id} item={{ id: g.id, title: g.title, description: g.description, imageUrl: g.imageUrl, imageCount: g.imageCount, createdAt: g.createdAt.toISOString(), programTitle: g.programSlug ? getCareerProgram(g.programSlug)?.title ?? null : null }} />
          ))}
        </ul>
      )}
    </div>
  );
}
