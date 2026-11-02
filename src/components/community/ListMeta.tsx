/** 목록 위 "총 N건 (p/P 페이지)" */
export function ListMeta({ total, page, totalPages }: { total: number; page: number; totalPages: number }) {
  return (
    <p className="mb-4 flex items-center gap-1.5 text-[15px] text-muted">
      <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" className="h-4 w-4">
        <path d="M4 1.5h5.5L12.5 4.5v10h-8.5z M9.5 1.5v3h3 M6 8h4.5 M6 10.5h4.5" strokeLinejoin="round" />
      </svg>
      총 <strong className="font-semibold text-ink">{total}</strong>건
      <span className="tabular-nums">
        (<span className="text-green">{page}</span>/{totalPages} 페이지)
      </span>
    </p>
  );
}
