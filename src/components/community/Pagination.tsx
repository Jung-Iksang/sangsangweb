import Link from "next/link";

/** 경로 기반 페이지네이션 (/base, /base/page/2 …) — 모든 페이지가 정적 HTML로 수집됨 */
export function Pagination({ base, page, totalPages }: { base: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const href = (n: number) => (n === 1 ? base : `${base}/page/${n}`);
  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => start + i);
  const btn = "flex h-9 min-w-9 items-center justify-center rounded-sm px-2.5 text-[0.875rem] font-medium tabular-nums";
  return (
    <nav aria-label="페이지 이동" className="mt-10 flex justify-center">
      <ul className="flex items-center gap-1">
        {page > 1 && (
          <li>
            <Link href={href(page - 1)} className={`${btn} text-muted hover:bg-cream`} rel="prev" aria-label="이전 페이지">
              ‹
            </Link>
          </li>
        )}
        {pages.map((n) => (
          <li key={n}>
            {n === page ? (
              <span aria-current="page" className={`${btn} bg-ink text-on-ink`}>{n}</span>
            ) : (
              <Link href={href(n)} className={`${btn} text-body hover:bg-cream`}>{n}</Link>
            )}
          </li>
        ))}
        {page < totalPages && (
          <li>
            <Link href={href(page + 1)} className={`${btn} text-muted hover:bg-cream`} rel="next" aria-label="다음 페이지">
              ›
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
