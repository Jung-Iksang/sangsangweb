import Link from "next/link";

/** 섹션 머리: 번호 + 가는 선 + 전체보기 / 제목 / 설명 */
export function SectionHead({
  no,
  title,
  desc,
  moreHref,
  moreLabel = "전체보기",
  id,
}: {
  no: string;
  title: React.ReactNode;
  desc?: string;
  moreHref?: string;
  moreLabel?: string;
  id?: string;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <div className="flex items-center gap-4">
        <span className="num">{no}</span>
        <span aria-hidden className="h-px flex-1 bg-line" />
        {moreHref && (
          <Link href={moreHref} className="link-more">
            {moreLabel}
          </Link>
        )}
      </div>
      <h2 id={id} className="t-h2 mt-5">
        {title}
      </h2>
      {desc && <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-muted">{desc}</p>}
    </div>
  );
}
