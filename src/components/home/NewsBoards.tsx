import Link from "next/link";
import { getLatestPosts, type PostSummary } from "@/lib/data";
import { boardLabel, formatDate } from "@/lib/format";
import type { BoardType } from "@/db/schema";

export async function NewsBoards() {
  const [notice, press] = await Promise.all([getLatestPosts("notice", 5), getLatestPosts("press", 5)]);
  return (
    <section aria-labelledby="news-title" className="bg-surface py-20 md:py-28">
      <div className="container-site">
        <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.18em] text-primary">News</p>
        <h2 id="news-title" className="mb-10 text-[26px] font-bold text-ink md:text-[34px]">상상마루 소식</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <Board board="notice" items={notice} />
          <Board board="press" items={press} />
        </div>
      </div>
    </section>
  );
}

function Board({ board, items }: { board: BoardType; items: PostSummary[] }) {
  return (
    <div className="min-w-0 rounded-card bg-white p-6 ring-1 ring-line md:p-8">
      <div className="mb-4 flex items-center justify-between border-b-2 border-ink pb-4">
        <h3 className="text-[20px] font-bold text-ink">{boardLabel[board]}</h3>
        <Link href={`/community/${board}`} className="text-[14px] font-medium text-muted hover:text-primary" aria-label={`${boardLabel[board]} 전체보기`}>
          전체보기 +
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="py-10 text-center text-[14px] text-muted">등록된 글이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((p) => (
            <li key={p.id}>
              <Link href={`/community/${board}/${p.id}`} className="group flex items-center gap-3 py-3.5">
                <span className="min-w-0 flex-1 truncate text-[15.5px] text-body group-hover:text-primary">{p.title}</span>
                {p.isNew && (
                  <span className="shrink-0 rounded-full bg-brand-red-ink px-1.5 py-0.5 text-[10px] font-bold leading-none text-white" title="새 글">
                    N
                  </span>
                )}
                <time dateTime={p.createdAt} className="shrink-0 text-[13px] text-muted">
                  {formatDate(p.createdAt)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
