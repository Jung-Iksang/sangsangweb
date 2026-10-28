import Link from "next/link";
import { BOARD_TYPES, type BoardType } from "@/db/schema";
import { adminListPosts } from "@/lib/admin-data";
import { boardLabel, formatDate } from "@/lib/format";
import { PostRowActions } from "@/components/admin/PostRowActions";
import { requireAdmin } from "@/lib/auth";

// 관리자 화면: 매 요청 서버 렌더링 (DB 최신값 · 로그인 확인)
export const instant = false;

export const metadata = { title: "게시글 관리" };

export default async function AdminPosts({ searchParams }: PageProps<"/admin/posts">) {
  await requireAdmin();
  const sp = await searchParams;
  const board: BoardType = BOARD_TYPES.includes(sp.board as BoardType) ? (sp.board as BoardType) : "notice";
  const page = Math.max(1, Number(sp.page) || 1);
  const { items, total, totalPages } = await adminListPosts(board, page);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-bold text-ink">{boardLabel[board]} 관리</h1>
          <p className="mt-1 text-muted">총 {total}건</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/community/${board}`} target="_blank" className="rounded-btn border border-line bg-white px-5 py-2.5 text-[14px] font-bold text-ink hover:border-green">
            홈페이지에서 보기
          </Link>
          <Link href={`/admin/posts/new?board=${board}`} className="rounded-btn bg-green px-5 py-2.5 text-[14px] font-bold text-white hover:bg-green-dark">
            + 새 글 쓰기
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white border border-line">
        {items.length === 0 ? (
          <p className="py-16 text-center text-muted">등록된 글이 없습니다.</p>
        ) : (
          <table className="w-full text-[14.5px]">
            <thead className="bg-cream text-left text-[13px] text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">제목</th>
                <th className="hidden w-28 px-3 py-3 font-medium md:table-cell">작성일</th>
                <th className="hidden w-20 px-3 py-3 font-medium sm:table-cell">조회</th>
                <th className="w-[230px] px-5 py-3 text-right font-medium">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {items.map((p) => (
                <tr key={p.id}>
                  <td className="max-w-0 px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {!p.isPublished && <span className="shrink-0 rounded bg-brand-red/10 px-1.5 py-0.5 text-[11px] font-bold text-red">비공개</span>}
                      <Link href={`/admin/posts/${p.id}/edit`} className="truncate text-ink hover:text-green">{p.title}</Link>
                    </div>
                  </td>
                  <td className="hidden px-3 text-muted md:table-cell">{formatDate(p.createdAt)}</td>
                  <td className="hidden px-3 text-muted sm:table-cell">{p.views}</td>
                  <td className="px-5">
                    <PostRowActions id={p.id} board={board} isPublished={p.isPublished} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <nav className="flex justify-center gap-1" aria-label="페이지">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={`/admin/posts?board=${board}&page=${n}`}
              className={`flex h-9 min-w-9 items-center justify-center rounded-btn px-3 text-[14px] ${n === page ? "bg-green text-white" : "bg-white text-body border border-line"}`}
            >
              {n}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
