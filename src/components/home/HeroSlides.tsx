"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type HeroSlide = {
  src: string;
  alt: string;
  caption: string;
};

/**
 * 히어로 활동 사진 — 한 번에 한 장, 7초마다 천천히 교차 페이드.
 * 설명과 조작부는 사진 아래에 배치.
 *
 * - 서버 HTML에 모든 사진이 alt와 함께 들어간다 (검색엔진).
 * - 첫 장만 미리 불러옴(LCP).
 * - 화면에 보일 때만 넘어간다.
 * - 마우스를 올리거나 일시정지 버튼을 누르면 멈춘다.
 * - '동작 줄이기' 설정이면 첫 장에 고정하고 버튼도 숨긴다.
 */
export function HeroSlides({
  slides,
  intervalMs = 7000,
}: {
  slides: HeroSlide[];
  intervalMs?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const [i, setI] = useState(0);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [hover, setHover] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = ref.current;

    if (!el || slides.length < 2) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const raf = requestAnimationFrame(() => setEnabled(true));

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [slides.length]);

  useEffect(() => {
    if (!enabled || !visible || hover || paused) return;

    const t = setTimeout(
      () => setI((n) => (n + 1) % slides.length),
      intervalMs
    );

    return () => clearTimeout(t);
  }, [enabled, visible, hover, paused, i, slides.length, intervalMs]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="min-w-0"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-white">
        {slides.map((s, n) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            preload={n === 0}
            sizes="(min-width:2520px) 1140px, (min-width:1024px) 50vw, (min-width:640px) 90vw, calc(100vw - 40px)"
            aria-hidden={n !== i ? true : undefined}
            className={`object-cover transition-opacity duration-[1200ms] ease-in-out ${
              n === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="flex min-h-14 flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-2">
        <p
          aria-live={enabled && !paused && !hover ? "off" : "polite"}
          className="flex items-center gap-3 text-[0.8125rem] font-medium text-body"
        >
          <span aria-hidden className="num">
            {String(i + 1).padStart(2, "0")}
          </span>
          {slides[i].caption}
        </p>

        <div className="ml-auto flex items-center gap-1">
          <span className="flex">
            {slides.map((s, n) => (
              <button
                key={s.src}
                type="button"
                onClick={() => setI(n)}
                aria-label={`${n + 1}번째 사진 보기: ${s.caption}`}
                aria-current={n === i ? "true" : undefined}
                className="group/bar flex h-11 w-8 items-center px-1"
              >
                <span
                  className={`h-[3px] w-full transition-colors duration-500 ${
                    n === i
                      ? "bg-green"
                      : "bg-line-strong group-hover/bar:bg-muted"
                  }`}
                />
              </button>
            ))}
          </span>

          {/* 자리는 처음부터 잡아 두고(막대 위치 고정), 자동 넘김이 켜질 때만 보임 */}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-label={
              paused ? "사진 넘기기 재생" : "사진 넘기기 일시정지"
            }
            className={`flex h-11 w-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-cream hover:text-ink ${
              enabled ? "" : "invisible"
            }`}
          >
            {paused ? (
              <svg
                viewBox="0 0 16 16"
                className="h-3 w-3"
                fill="currentColor"
                aria-hidden
              >
                <path d="M4 2.5v11l9-5.5z" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 16 16"
                className="h-3 w-3"
                fill="currentColor"
                aria-hidden
              >
                <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
