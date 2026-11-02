import { formatDate } from "@/lib/format";

/** 상세 상단: 글 제목(페이지 h1) + 작성자 | 날짜 | 조회 메타 한 줄 — SubPage bandTitle 과 함께 사용 */
export function DetailHead({ title, createdAt, views }: { title: string; createdAt: string; views?: number }) {
  const meta = [
    <span key="a">관리자</span>,
    <time key="d" dateTime={createdAt} className="tabular-nums">{formatDate(createdAt)}</time>,
    ...(views === undefined ? [] : [<span key="v" className="tabular-nums">조회 {views.toLocaleString("ko-KR")}</span>]),
  ];
  return (
    <header className="border-b border-line border-t-2 border-t-ink px-1 py-6 md:px-4">
      <h1 className="text-[clamp(1.25rem,1.1rem+0.5vw,1.5rem)] font-semibold leading-snug text-ink">{title}</h1>
      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] text-muted">
        {meta.map((m, i) => (
          <span key={i} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden className="h-2.5 w-px bg-line-strong" />}
            {m}
          </span>
        ))}
      </p>
    </header>
  );
}
