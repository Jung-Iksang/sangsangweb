"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { useCallback, useEffect, useRef, useState } from "react";
import { CarouselArrow } from "@/components/ui/CarouselArrow";
import { DroneBall } from "@/components/ui/DroneBall";
import { SectionHead } from "./SectionHead";

export type ProgramCard = {
  href: string;
  title: string;
  category: string;
  badge?: string;
  image: string;
  target: string;
  period: string;
  tags: string[];
};

/** 자동으로 흐르는 속도 (px / 1/60초) — 0.6 ≈ 초당 36px */
const SPEED = 0.6;
/** 마우스가 나가거나 이동이 끝나면 기다리지 않고 바로 다시 흐름 */
const RESUME_DELAY = 0;

/**
 * 프로그램 카드 슬라이더 (끝에서 처음으로 이어지는 무한 루프)
 * - 끊김 없이 계속 천천히 옆으로 흐름(embla-carousel-auto-scroll). 마우스를 올리거나 키보드 포커스가 있거나
 *   화면 밖이거나 끌고 있으면 멈춤, 일시정지 버튼 ('동작 줄이기' 설정이면 흐르지 않음 — 화살표·막대로만 이동)
 * - 재생·정지는 이 컴포넌트의 상태(running)만 결정하고 플러그인은 그 지시만 따름
 * - 아래 흰 막대: 현재 위치를 따라 부드럽게 움직이고, 칸을 누르거나 끌면 그 위치로 이동
 */
export function ProgramSlider({ cards }: { cards: ProgramCard[] }) {
  const [plugins] = useState(() => [
    AutoScroll({ speed: SPEED, startDelay: RESUME_DELAY, playOnInit: false, stopOnInteraction: true, stopOnFocusIn: false, stopOnMouseEnter: false }),
  ]);
  const [ref, api] = useEmblaCarousel({ align: "start", loop: true }, plugins);
  const [selected, setSelected] = useState(0);
  const [canAuto, setCanAuto] = useState(false); // 동작 줄이기가 아니면 true
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);
  const [focusIn, setFocusIn] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const [navigating, setNavigating] = useState(false); // 화살표·막대로 이동 중
  const thumbRef = useRef<HTMLSpanElement>(null);
  const thumb2Ref = useRef<HTMLSpanElement>(null);
  const handleRef = useRef<HTMLSpanElement>(null);
  const ballRef = useRef<SVGSVGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);

  const onSelect = useCallback(() => {
    if (api) setSelected(api.selectedScrollSnap());
  }, [api]);

  // 막대 위치: 매 프레임 바뀌므로 React 상태 대신 DOM 직접 갱신 (끝→처음 넘어갈 때 이어지도록 막대 2개)
  const onScroll = useCallback(() => {
    if (!api) return;
    const p = ((api.scrollProgress() % 1) + 1) % 1;
    if (thumbRef.current) thumbRef.current.style.left = `${p * 100}%`;
    if (thumb2Ref.current) thumb2Ref.current.style.left = `${p * 100 - 100}%`;
    // 손잡이는 현재 위치 막대의 가운데 (끝→처음 넘어갈 때도 이어지게)
    if (handleRef.current) handleRef.current.style.left = `${((p + 0.5 / cards.length) % 1) * 100}%`;
    // 공이 굴러가듯 회전 (한 바퀴 = 360° 의 배수라 끝→처음 넘어갈 때도 끊김 없음)
    if (ballRef.current) ballRef.current.style.transform = `rotate(${p * 1080}deg)`;
  }, [api, cards.length]);

  useEffect(() => {
    if (!api) return;
    const raf = requestAnimationFrame(() => {
      onSelect();
      onScroll();
    });
    const down = () => setDragging(true);
    const up = () => setDragging(false);
    const settled = () => setNavigating(false);
    api
      .on("select", onSelect)
      .on("reInit", onSelect)
      .on("scroll", onScroll)
      .on("reInit", onScroll)
      .on("pointerDown", down)
      .on("pointerUp", up)
      .on("settle", settled);
    return () => {
      cancelAnimationFrame(raf);
      api
        .off("select", onSelect)
        .off("reInit", onSelect)
        .off("scroll", onScroll)
        .off("reInit", onScroll)
        .off("pointerDown", down)
        .off("pointerUp", up)
        .off("settle", settled);
    };
  }, [api, onSelect, onScroll]);

  // 동작 줄이기 확인 + 화면에 보이는지 관찰
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const raf = requestAnimationFrame(() => setCanAuto(true));
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const running = canAuto && visible && !hover && !focusIn && !dragging && !paused && !navigating;

  // 계속 흐르기 / 멈추기
  useEffect(() => {
    const auto = api?.plugins().autoScroll;
    if (!auto) return;
    if (running) auto.play();
    else auto.stop();
  }, [api, running]);

  // 화살표·막대로 이동: 흐름을 멈추고 이동 → 도착(settle)하면 다시 흐름
  const go = (move: (a: NonNullable<typeof api>) => void) => {
    if (!api) return;
    api.plugins().autoScroll?.stop();
    setNavigating(true);
    move(api);
  };

  // 막대에서 누른·끈 위치 → 카드 번호
  const scrubTo = (clientX: number) => {
    const track = trackRef.current;
    if (!api || !track) return;
    const r = track.getBoundingClientRect();
    const ratio = Math.min(0.9999, Math.max(0, (clientX - r.left) / r.width));
    const idx = Math.floor(ratio * cards.length);
    if (idx !== api.selectedScrollSnap()) go((a) => a.scrollTo(idx));
  };

  const n = cards.length;

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-[minmax(0,1fr)] items-start"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => {
        // 키보드로 들어온 포커스만 멈춤 (마우스로 버튼을 누른 뒤에도 계속 넘어가도록)
        if (e.target.matches(":focus-visible")) setFocusIn(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocusIn(false);
      }}
    >
      <SectionHead
        id="programs-title"
        tone="dark"
        title="상상마루 프로그램"
        desc="학교와 지역에서 만나는 아홉 가지 교육·체험 프로그램"
        moreHref="/education/afterschool"
        moreLabel="전체 프로그램"
        actions={
          <>
            {canAuto && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "프로그램 자동 흐름 재생" : "프로그램 자동 흐름 일시정지"}
                className="flex h-11 w-11 items-center justify-center rounded-btn border border-white/35 text-white transition-colors hover:border-white hover:bg-white hover:text-navy"
              >
                {paused ? (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                    <path d="M4 2.5v11l9-5.5z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
                    <path d="M4 2.5h3v11H4zM9 2.5h3v11H9z" />
                  </svg>
                )}
              </button>
            )}
            <CarouselArrow tone="dark" dir="prev" label="프로그램" disabled={false} onClick={() => go((a) => a.scrollPrev())} />
            <CarouselArrow tone="dark" dir="next" label="프로그램" disabled={false} onClick={() => go((a) => a.scrollNext())} />
          </>
        }
      />
      {/* 위아래 여백: hover 로 떠오른 카드·그림자가 잘리지 않게 (바깥 배치는 그대로) */}
      <div ref={ref} className="-mb-8 -mt-3 overflow-hidden pb-8 pt-3">
        <ul className="-ml-6 flex touch-pan-y">
          {cards.map((c, i) => (
            <li
              key={c.href}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${n}`}
              className="min-w-0 shrink-0 grow-0 basis-full pl-6 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
            >
              <Link
                href={c.href}
                className="program-card group block h-full overflow-hidden rounded-md bg-white transition-[translate,box-shadow] duration-300 ease-out hover:shadow-lift focus-visible:shadow-lift motion-safe:hover:-translate-y-1.5 motion-safe:focus-visible:-translate-y-1.5"
              >
                <div className="relative aspect-[3/2] overflow-hidden bg-line">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(min-width:1280px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, calc(100vw - 30px)"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <span className="absolute bottom-3 left-3 rounded-sm bg-ink/85 px-2.5 py-1 type-caption font-medium text-white">
                    {c.category}
                  </span>
                  {c.badge && (
                    <span className="absolute right-3 top-3 rounded-sm border border-line bg-white px-2.5 py-1 type-caption font-medium text-ink">
                      {c.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 lg:p-7">
                  <h3 className="program-card-title type-card-title truncate text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
                    {c.title}
                  </h3>
                  <dl className="type-body mt-3 space-y-1">
                    <div className="flex gap-3">
                      <dt className="w-9 shrink-0 font-medium text-ink">대상</dt>
                      <dd className="min-w-0 truncate text-muted">{c.target}</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-9 shrink-0 font-medium text-ink">운영</dt>
                      <dd className="min-w-0 truncate text-muted">{c.period}</dd>
                    </div>
                  </dl>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-line pt-4">
                    <ul className="flex max-h-[1.625rem] min-w-0 flex-wrap gap-1.5 overflow-hidden" aria-label="키워드">
                      {c.tags.map((t) => (
                        <li key={t} className="program-tag shrink-0 py-0.5 font-normal text-blue">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* 위치 막대 — 칸을 누르거나 막대를 좌우로 끌어 이동.
          마우스를 올리면: 좌우 화살표 커서 · 선이 굵고 밝아짐 · 칸 눈금 · ‹ › 손잡이 · 가리킨 칸의 프로그램 이름 */}
      <div
        ref={trackRef}
        role="group"
        aria-label="프로그램 위치"
        className="group/track relative mt-8 flex h-10 cursor-ew-resize touch-none select-none items-center"
        onPointerDown={(e) => {
          scrubbing.current = true;
          setDragging(true);
          e.currentTarget.setPointerCapture(e.pointerId);
          scrubTo(e.clientX);
        }}
        onPointerMove={(e) => {
          if (scrubbing.current) scrubTo(e.clientX);
        }}
        onPointerUp={() => {
          scrubbing.current = false;
          setDragging(false);
        }}
        onPointerCancel={() => {
          scrubbing.current = false;
          setDragging(false);
        }}
      >
        <span
          aria-hidden
          className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/25 transition-all duration-200 group-hover/track:h-1 group-hover/track:bg-white/35 group-focus-within/track:h-1 group-focus-within/track:bg-white/35"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden transition-[height] duration-200 group-hover/track:h-1.5 group-focus-within/track:h-1.5"
        >
          <span ref={thumbRef} className="absolute inset-y-0 bg-white" style={{ width: `${100 / n}%`, left: "0%" }} />
          <span ref={thumb2Ref} className="absolute inset-y-0 bg-white" style={{ width: `${100 / n}%`, left: "-100%" }} />
        </span>
        {/* 드론축구공 손잡이 — 케이지 + 가운데 드론. 항상 보이고 흐름에 따라 굴러감,
            마우스를 올리거나 끄는 동안 살짝 커지고 양옆에 ‹ › */}
        <span
          ref={handleRef}
          aria-hidden
          className="pointer-events-none absolute top-1/2 z-10 h-8 w-8 -translate-x-1/2 -translate-y-1/2 transition-[scale] duration-200 group-hover/track:scale-115 group-focus-within/track:scale-115 group-active/track:scale-115"
          style={{ left: `${50 / n}%` }}
        >
          <DroneBall ref={ballRef} />
          <svg
            viewBox="0 0 8 12"
            className="absolute -left-4 top-1/2 h-3.5 w-2.5 -translate-y-1/2 overflow-visible opacity-0 transition-opacity duration-200 group-hover/track:opacity-100 group-focus-within/track:opacity-100 group-active/track:opacity-100"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 흰 테두리 + 진한 초록 선: 흰 막대 위·초록 바탕 위 어디서든 보이게 */}
            <path d="M6 2 2 6l4 4" stroke="white" strokeWidth={4.5} />
            <path d="M6 2 2 6l4 4" strokeWidth={2} className="stroke-green-dark" />
          </svg>
          <svg
            viewBox="0 0 8 12"
            className="absolute -right-4 top-1/2 h-3.5 w-2.5 -translate-y-1/2 overflow-visible opacity-0 transition-opacity duration-200 group-hover/track:opacity-100 group-focus-within/track:opacity-100 group-active/track:opacity-100"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* 흰 테두리 + 진한 초록 선: 흰 막대 위·초록 바탕 위 어디서든 보이게 */}
            <path d="M2 2l4 4-4 4" stroke="white" strokeWidth={4.5} />
            <path d="M2 2l4 4-4 4" strokeWidth={2} className="stroke-green-dark" />
          </svg>
        </span>
        {cards.map((c, i) => (
          <button
            key={c.href}
            type="button"
            tabIndex={i === selected ? 0 : -1}
            aria-label={`${i + 1}번째 프로그램으로 이동: ${c.title}`}
            aria-current={i === selected ? "true" : undefined}
            onClick={() => go((carousel) => carousel.scrollTo(i))}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                e.preventDefault();
                const next = (selected + (e.key === "ArrowRight" ? 1 : -1) + n) % n;
                go((a) => a.scrollTo(next));
                const btns = trackRef.current?.querySelectorAll("button");
                (btns?.[next] as HTMLButtonElement | undefined)?.focus();
              }
            }}
            className="group/seg relative h-full flex-1 focus-visible:outline-offset-[-2px]"
          >
            {/* 칸 눈금 */}
            {i > 0 && (
              <span
                aria-hidden
                className="absolute left-0 top-1/2 h-3 w-px -translate-y-1/2 bg-white/0 transition-colors duration-200 group-hover/track:bg-white/40"
              />
            )}
            {/* 가리킨 칸 밝게 */}
            <span
              aria-hidden
              className="absolute inset-x-px top-1/2 h-1.5 -translate-y-1/2 bg-white/0 transition-colors duration-150 group-hover/seg:bg-white/30"
            />
            {/* 가리킨 칸의 프로그램 이름 (양 끝 칸은 막대 안쪽으로 정렬) */}
            <span
              aria-hidden
              className={`pointer-events-none absolute bottom-full mb-0.5 translate-y-1 whitespace-nowrap rounded-sm bg-white px-2 py-1 text-[0.75rem] font-semibold text-green opacity-0 transition-[opacity,translate] duration-150 group-hover/seg:translate-y-0 group-hover/seg:opacity-100 group-focus-visible/seg:translate-y-0 group-focus-visible/seg:opacity-100 ${
                i === 0 ? "left-0" : i === n - 1 ? "right-0" : "left-1/2 -translate-x-1/2"
              }`}
            >
              {c.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
