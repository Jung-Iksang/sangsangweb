"use client";

import { useEffect, useRef, useState } from "react";

export type YearLine = { year: number; text: string };

/**
 * 연도가 한 해씩 올라가며 그해 연혁 한 줄이 함께 바뀌는 효과 (2012 → 최근 연도 → 다시 2012, 반복).
 * - 화면에 보일 때만 돌고, 마우스를 올리거나 일시정지 버튼을 누르면 멈춘다 (자동으로 바뀌는 콘텐츠 접근성 기준).
 * - 서버 HTML 에는 최근 연도와 한 줄이 들어가 검색엔진은 그 값을 읽는다.
 * - '동작 줄이기' 설정 사용자에게는 움직임 없이 최근 연도만 보여 준다.
 */
export function YearTicker({
  items,
  stepMs = 1000,
  holdLastMs = 3200,
}: {
  items: YearLine[];
  /** 한 해가 머무는 시간 */
  stepMs?: number;
  /** 마지막 연도에서 처음으로 돌아가기 전 머무는 시간 */
  holdLastMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const last = items.length - 1;
  const [i, setI] = useState(last);
  const [enabled, setEnabled] = useState(false); // 동작 줄이기 설정이 아니면 true
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(false);
  const started = useRef(false);

  // 동작 줄이기 확인 + 화면에 보이는지 관찰
  useEffect(() => {
    const el = ref.current;
    if (!el || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raf = requestAnimationFrame(() => setEnabled(true));
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [items.length]);

  // 처음 보일 때 2012 부터 시작
  useEffect(() => {
    if (!enabled || !visible || started.current) return;
    started.current = true;
    const raf = requestAnimationFrame(() => setI(0));
    return () => cancelAnimationFrame(raf);
  }, [enabled, visible]);

  // 한 해씩 넘기기 (마지막 연도는 조금 더 오래 머문 뒤 처음으로)
  useEffect(() => {
    if (!enabled || !visible || hover || paused || !started.current) return;
    const t = setTimeout(() => setI((n) => (n >= last ? 0 : n + 1)), i >= last ? holdLastMs : stepMs);
    return () => clearTimeout(t);
  }, [enabled, visible, hover, paused, i, last, stepMs, holdLastMs]);

  const cur = items[i];
  return (
    <div ref={ref} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <span className="flex items-center gap-2.5">
        <span className="block overflow-hidden">
          <span key={cur.year} className="tick-up block tabular-nums">
            {cur.year}
          </span>
        </span>
        {enabled && (
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={paused ? "연혁 넘기기 재생" : "연혁 넘기기 일시정지"}
            className="flex h-7 w-7 items-center justify-center rounded-sm border border-line text-muted transition-colors hover:border-ink hover:text-ink"
          >
            {paused ? (
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
                <path d="M4 2.5v11l9-5.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor" aria-hidden>
                <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
              </svg>
            )}
          </button>
        )}
      </span>
      <span className="mt-1.5 block min-h-[2.8em] overflow-hidden text-[0.78125rem] font-normal leading-snug tracking-normal text-muted md:text-[0.8125rem]">
        <span key={cur.year} className="tick-up line-clamp-2">
          {cur.text}
        </span>
      </span>
    </div>
  );
}
