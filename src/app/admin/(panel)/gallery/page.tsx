import { adminListGallery } from "@/lib/admin-data";
import { GalleryUploader } from "@/components/admin/GalleryUploader";
import { GalleryItemCard } from "@/components/admin/GalleryItemCard";
import { requireAdmin } from "@/lib/auth";

// 관리자 화면: 매 요청 서버 렌더링 (DB 최신값 · 로그인 확인)
export const instant = false;

export const metadata = { title: "갤러리 관리" };

export default async function AdminGallery() {
  await requireAdmin();
  const items = await adminListGallery();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[26px] font-bold text-ink">갤러리 관리</h1>
        <p className="mt-1 text-muted">총 {items.length}장 · 사진 제목은 검색 결과와 이미지 설명(alt)으로 쓰이니 구체적으로 적어 주세요.</p>
      </div>
      <GalleryUploader />
      {items.length === 0 ? (
        <p className="rounded-md bg-white py-16 text-center text-muted border border-line">등록된 사진이 없습니다.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <GalleryItemCard key={g.id} item={{ id: g.id, title: g.title, description: g.description, imageUrl: g.imageUrl, createdAt: g.createdAt.toISOString() }} />
          ))}
        </ul>
      )}
    </div>
  );
}
