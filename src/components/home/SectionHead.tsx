import Link from "next/link";

/**
 * 섹션 머리: 번호 + 가는 선 + (actions) + 전체보기 / 제목 / 설명
 * - tone="dark": 초록·먹색 띠 위에서 쓰는 흰 글자 버전
 * - actions: 첫 줄 오른쪽 슬롯 (캐러셀 화살표 등)
 */
export function SectionHead({
  no,
  title,
  desc,
  moreHref,
  moreLabel = "전체보기",
  id,
  tone = "light",
  actions,
}: {
  no?: string;
  title: React.ReactNode;
  desc?: string;
  moreHref?: string;
  moreLabel?: string;
  id?: string;
  tone?: "light" | "dark";
  actions?: React.ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className="mb-6">
      <div className="flex items-center gap-4">
        {no && <span className={dark ? "num text-white/85" : "num"}>{no}</span>}
        <span aria-hidden className={`h-px flex-1 ${dark ? "bg-white/20" : "bg-line"}`} />
        {moreHref && (
          <Link
            href={moreHref}
            className={
              dark
                ? "whitespace-nowrap text-[0.875rem] font-semibold text-white underline decoration-white/40 underline-offset-[0.3125rem] transition-colors hover:decoration-white"
                : "link-more"
            }
          >
            {moreLabel}
          </Link>
        )}
        {actions && <div className="ml-2 flex gap-2">{actions}</div>}
      </div>
      <h2 id={id} className={`t-h2 mt-3 ${dark ? "text-white" : ""}`}>
        {title}
      </h2>
      {desc && (
        <p className={`type-reading mt-3 max-w-2xl ${dark ? "text-white/75" : "text-muted"}`}>{desc}</p>
      )}
    </div>
  );
}
