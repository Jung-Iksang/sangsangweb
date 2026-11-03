import Link from "next/link";
import { notFound } from "next/navigation";
import { SubPage } from "@/components/layout/SubPage";
import { getPostsPage, POSTS_PER_PAGE } from "@/lib/data";
import { boardLabel, formatDate } from "@/lib/format";
import type { BoardType } from "@/db/schema";
import { ListMeta } from "./ListMeta";
import { Pagination } from "./Pagination";

export const boardDescription: Record<BoardType, string> = {
  notice: "상상마루의 프로그램 모집, 운영 일정 등 새로운 소식을 알려드립니다.",
  press: "언론에 소개된 상상마루의 활동과 성과를 전해드립니다.",
};

export async function BoardList({ board, page }: { board: BoardType; page: number }) {
  const data = await getPostsPage(board, page);
  if (page > 1 && page > data.totalPages) notFound();
  const base = `/community/${board}`;
  const path = page === 1 ? base : `${base}/page/${page}`;

  return (
    <SubPage path={path} title={boardLabel[board]} description={boardDescription[board]}>
      <ListMeta total={data.total} page={page} totalPages={data.totalPages} />
      {data.items.length === 0 ? (
        <p className="border-y border-line py-20 text-center text-muted">등록된 글이 없습니다.</p>
      ) : (
        <table className="w-full table-fixed border-t-2 border-ink text-[17px]">
          <caption className="sr-only">{boardLabel[board]} 목록</caption>
          <thead className="bg-cream text-ink">
            <tr className="h-14 border-b border-line">
              <th scope="col" className="hidden w-20 font-semibold sm:table-cell">번호</th>
              <th scope="col" className="font-semibold">제목</th>
              <th scope="col" className="hidden w-32 font-semibold sm:table-cell">작성일</th>
              <th scope="col" className="hidden w-20 font-semibold md:table-cell">조회</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((p, i) => (
              <tr key={p.id} className="border-b border-line transition-colors hover:bg-cream">
                <td className="hidden text-center tabular-nums text-muted sm:table-cell">
                  {data.total - (page - 1) * POSTS_PER_PAGE - i}
                </td>
                <td className="px-3 py-[18px] sm:px-5">
                  <Link href={`${base}/${p.id}`} className="group flex min-w-0 items-center gap-2.5 text-ink">
                    <span className="truncate group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">{p.title}</span>
                    {p.isNew && <span className="shrink-0 text-[13px] font-bold tracking-wide text-red">NEW</span>}
                  </Link>
                  <time dateTime={p.createdAt} className="mt-1 block text-[14px] tabular-nums text-muted sm:hidden">
                    {formatDate(p.createdAt)}
                  </time>
                </td>
                <td className="hidden text-center tabular-nums text-muted sm:table-cell">
                  <time dateTime={p.createdAt}>{formatDate(p.createdAt)}</time>
                </td>
                <td className="hidden text-center tabular-nums text-muted md:table-cell">{p.views.toLocaleString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pagination base={base} page={page} totalPages={data.totalPages} />
    </SubPage>
  );
}
