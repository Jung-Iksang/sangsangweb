"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type HeroSlide = { src: string; alt: string; caption: string };

/**
 * 히어로 오른쪽 사진 — 한 번에 한 장, 7초마다 천천히 교차 페이드.
 * - 서버 HTML 에 모든 사진이 alt 와 함께 들어간다 (검색엔진). 첫 장만 미리 불러옴(LCP).
 * - 화면에 보일 때만 넘어가고, 마우스를 올리거나 일시정지 버튼을 누르면 멈춘다 (자동 전환 콘텐츠 접근성 기준).
 * - '동작 줄이기' 설정이면 첫 장에 고정하고 버튼도 숨긴다.
 */
export function HeroSlides({ slides, intervalMs = 7000 }: { slides: HeroSlide[]; intervalMs?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raf = requestAnimationFrame(() => setEnabled(true));
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [slides.length]);

  useEffect(() => {
    if (!enabled || !visible || hover || paused) return;
    const t = setTimeout(() => setI((n) => (n + 1) % slides.length), intervalMs);
    return () => clearTimeout(t);
  }, [enabled, visible, hover, paused, i, slides.length, intervalMs]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative aspect-[4/3] overflow-hidden bg-line lg:aspect-auto lg:h-full"
    >
      {slides.map((s, n) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt}
          fill
          preload={n === 0}
          sizes="(min-width:1024px) 58vw, 100vw"
          aria-hidden={n !== i ? true : undefined}
          className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${n === i ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {/* 캡션: 왼쪽 아래 (글자 길이가 달라도 아래 조작 버튼 위치에 영향 없음) */}
      <p
        aria-live={enabled && !paused && !hover ? "off" : "polite"}
        className="absolute bottom-4 left-4 rounded-sm bg-ink/85 px-3 py-1.5 text-[13px] font-medium text-white md:bottom-6 md:left-6"
      >
        {slides[i].caption}
      </p>
      {/* 막대(사진 고르기, 누른 사진부터 다시 7초) + 일시정지: 오른쪽 아래 고정 */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 md:bottom-6 md:right-6">
        <span className="flex">
          {slides.map((s, n) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`${n + 1}번째 사진 보기: ${s.caption}`}
              aria-current={n === i ? "true" : undefined}
              className="group/bar flex h-7 w-8 items-center px-1"
            >
              <span
                className={`h-[3px] w-full transition-colors duration-500 ${n === i ? "bg-white" : "bg-white/45 group-hover/bar:bg-white/80"}`}
              />
            </button>
          ))}
        </span>
        {/* 자리는 처음부터 잡아 두고(막대 위치 고정), 자동 넘김이 켜질 때만 보임 */}
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? "사진 넘기기 재생" : "사진 넘기기 일시정지"}
          className={`flex h-7 w-7 items-center justify-center rounded-sm border border-white/50 bg-ink/40 text-white transition-colors hover:border-white hover:bg-ink/70 ${enabled ? "" : "invisible"}`}
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
      </div>
    </div>
  );
}
