/** 캐러셀 이전·다음 버튼 (정사각 44px, 모서리 8px) — light: 종이 바탕 / dark: 초록 띠 위 */
export function CarouselArrow({
  dir,
  disabled,
  onClick,
  label,
  tone = "light",
}: {
  dir: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
  /** 예: "사진", "프로그램" → "이전 사진" */
  label: string;
  tone?: "light" | "dark";
}) {
  const color =
    tone === "dark"
      ? "border-white/35 text-white hover:border-white hover:bg-white hover:text-green"
      : "border-line-strong text-ink hover:border-ink hover:bg-ink hover:text-on-ink";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${dir === "prev" ? "이전" : "다음"} ${label}`}
      className={`flex h-11 w-11 items-center justify-center rounded-btn border transition-colors disabled:pointer-events-none disabled:opacity-30 ${color}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
