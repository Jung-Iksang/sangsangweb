import Link from "next/link";

type Item = { id: number; title: string } | null;

/** 상세 하단 이전글 | 다음글 2칸 바 (게시판·갤러리 공용) */
export function PrevNext({ prev, next, base }: { prev: Item; next: Item; base: string }) {
  return (
    <nav aria-label="이전·다음 글" className="mt-8 grid grid-cols-2 divide-x divide-line rounded-sm border border-line bg-white text-[16px]">
      <Cell item={prev} base={base} label="이전글" dir="prev" />
      <Cell item={next} base={base} label="다음글" dir="next" />
    </nav>
  );
}

function Cell({ item, base, label, dir }: { item: Item; base: string; label: string; dir: "prev" | "next" }) {
  const isNext = dir === "next";
  const tag = (
    <span className={`flex shrink-0 items-center gap-2 font-semibold text-ink ${isNext ? "order-2" : ""}`}>
      {!isNext && <Arrow dir="prev" />}
      {label}
      {isNext && <Arrow dir="next" />}
    </span>
  );
  const cls = `flex min-w-0 items-center gap-4 px-4 py-4 md:px-5 ${isNext ? "justify-between" : ""}`;
  if (!item) {
    return (
      <div className={cls}>
        {tag}
        <span className="truncate text-muted/80">{label}이 없습니다.</span>
      </div>
    );
  }
  return (
    <Link href={`${base}/${item.id}`} rel={dir} className={`group ${cls} hover:bg-paper`}>
      {tag}
      <span className="truncate text-muted group-hover:text-ink">{item.title}</span>
    </Link>
  );
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg aria-hidden viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-2 w-2 text-muted">
      <path d={dir === "prev" ? "M5.5 1 2.5 4l3 3" : "M2.5 1 5.5 4l-3 3"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
