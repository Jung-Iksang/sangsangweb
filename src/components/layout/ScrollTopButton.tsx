"use client";

export function ScrollTopButton() {
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" })}
      className="flex h-8 w-8 items-center justify-center rounded-sm border border-on-ink/25 text-on-ink transition-colors hover:border-on-ink hover:bg-on-ink hover:text-ink"
      aria-label="맨 위로"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 15l6-6 6 6" />
      </svg>
    </button>
  );
}
