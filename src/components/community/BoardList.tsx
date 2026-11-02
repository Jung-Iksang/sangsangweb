import Link from "next/link";
import { notFound } from "next/navigation";
import { SubPage } from "@/components/layout/SubPage";
import { getPostsPage, POSTS_PER_PAGE } from "@/lib/data";
import { boardLabel, formatDate } from "@/lib/format";
import type { BoardType } from "@/db/schema";
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
      <p className="mb-4 text-[0.875rem] text-muted">
        총 <strong className="text-ink">{data.total}</strong>건{page > 1 && ` · ${page}페이지`}
      </p>
      {data.items.length === 0 ? (
        <p className="border-y border-line py-20 text-center text-muted">등록된 글이 없습니다.</p>
      ) : (
        <ul className="border-t-2 border-ink">
          {data.items.map((p, i) => (
            <li key={p.id} className="border-b border-line">
              <Link href={`${base}/${p.id}`} className="group flex items-center gap-4 px-2 py-5 md:px-4">
                <span className="hidden w-10 shrink-0 text-center text-[0.875rem] text-muted sm:block">
                  {data.total - (page - 1) * POSTS_PER_PAGE - i}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="flex items-center gap-2.5 type-list-title text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
                    <span className="truncate">{p.title}</span>
                    {p.isNew && (
                      <span className="shrink-0 text-[0.6875rem] font-bold tracking-wide text-red">NEW</span>
                    )}
                  </h2>
                  {p.excerpt && <p className="type-small mt-1 line-clamp-1 text-muted">{p.excerpt}</p>}
                </div>
                <time dateTime={p.createdAt} className="type-small shrink-0 tabular-nums text-muted">
                  {formatDate(p.createdAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Pagination base={base} page={page} totalPages={data.totalPages} />
    </SubPage>
  );
}
