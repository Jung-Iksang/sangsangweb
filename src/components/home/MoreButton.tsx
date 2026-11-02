import Link from "next/link";

/** 열 머리 오른쪽 + (전체보기) 사각 버튼 — CarouselArrow 와 같은 모양 */
export function MoreButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      aria-label={`${label} 전체보기`}
      className="flex h-11 w-11 items-center justify-center rounded-btn border border-line-strong text-ink transition-colors hover:border-ink hover:bg-ink hover:text-on-ink"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path strokeLinecap="round" d="M12 5v14M5 12h14" />
      </svg>
    </Link>
  );
}
