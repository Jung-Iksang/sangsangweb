import Link from "next/link";
import { getLatestPosts, type PostSummary } from "@/lib/data";
import { boardLabel, formatDate } from "@/lib/format";
import type { BoardType } from "@/db/schema";
import { SectionHead } from "./SectionHead";

export async function NewsBoards() {
  const [notice, press] = await Promise.all([getLatestPosts("notice", 5), getLatestPosts("press", 5)]);
  return (
    <section aria-labelledby="news-title" className="bg-cream py-20 md:py-28">
      <div className="container-site">
        <SectionHead no="04" id="news-title" title="상상마루 소식" />
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-12">
          <Board board="notice" items={notice} />
          <Board board="press" items={press} />
        </div>
      </div>
    </section>
  );
}

function Board({ board, items }: { board: BoardType; items: PostSummary[] }) {
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between border-b border-ink pb-4">
        <h3 className="text-[20px] font-bold text-ink">{boardLabel[board]}</h3>
        <Link href={`/community/${board}`} className="link-more" aria-label={`${boardLabel[board]} 전체보기`}>
          전체보기
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="py-12 text-[14px] text-muted">등록된 글이 없습니다.</p>
      ) : (
        <ul>
          {items.map((p) => (
            <li key={p.id} className="border-b border-line">
              <Link href={`/community/${board}/${p.id}`} className="group flex items-center gap-4 py-4">
                <span className="min-w-0 flex-1 truncate text-[16px] text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
                  {p.title}
                </span>
                {p.isNew && (
                  <span className="shrink-0 text-[11px] font-bold tracking-wide text-red" title="새 글">
                    NEW
                  </span>
                )}
                <time dateTime={p.createdAt} className="shrink-0 text-[13px] tabular-nums text-muted">
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
