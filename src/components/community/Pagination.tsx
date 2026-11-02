import Link from "next/link";

/** 경로 기반 페이지네이션 (/base, /base/page/2 …) — 모든 페이지가 정적 HTML로 수집됨 */
export function Pagination({ base, page, totalPages }: { base: string; page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  const href = (n: number) => (n === 1 ? base : `${base}/page/${n}`);
  const start = Math.max(1, Math.min(page - 4, totalPages - 9));
  const pages = Array.from({ length: Math.min(10, totalPages) }, (_, i) => start + i);
  const cell = "flex h-11 min-w-11 items-center justify-center rounded-sm px-2 text-[16px] tabular-nums";
  const box = `${cell} border border-line bg-white text-muted hover:border-line-strong hover:text-ink`;
  return (
    <nav aria-label="페이지 이동" className="mt-12 flex justify-center">
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        {page > 1 && (
          <>
            <li className="hidden sm:block">
              <Link href={href(1)} className={box} aria-label="첫 페이지">«</Link>
            </li>
            <li>
              <Link href={href(page - 1)} className={box} rel="prev" aria-label="이전 페이지">‹</Link>
            </li>
          </>
        )}
        {pages.map((n) => (
          <li key={n}>
            {n === page ? (
              <span aria-current="page" className={`${cell} bg-ink font-semibold text-on-ink`}>{n}</span>
            ) : (
              <Link href={href(n)} className={`${cell} text-body hover:bg-cream`}>{n}</Link>
            )}
          </li>
        ))}
        {page < totalPages && (
          <>
            <li>
              <Link href={href(page + 1)} className={box} rel="next" aria-label="다음 페이지">›</Link>
            </li>
            <li className="hidden sm:block">
              <Link href={href(totalPages)} className={box} aria-label="마지막 페이지">»</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
