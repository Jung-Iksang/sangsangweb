"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import type { GalleryCard } from "@/lib/data";

/** 포토갤러리 가로 캐러셀 — 서버에서 렌더된 목록을 그대로 보여주고, 화살표로 스크롤 */
export function GalleryCarousel({ items, dates }: { items: GalleryCard[]; dates: Record<number, string> }) {
  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps", dragFree: true });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    const raf = requestAnimationFrame(update);
    api.on("select", update).on("reInit", update).on("scroll", update);
    return () => {
      cancelAnimationFrame(raf);
      api.off("select", update).off("reInit", update).off("scroll", update);
    };
  }, [api, update]);

  return (
    <div>
      <div className="mb-6 flex justify-end gap-2">
        <ArrowButton dir="prev" disabled={!canPrev} onClick={() => api?.scrollPrev()} />
        <ArrowButton dir="next" disabled={!canNext} onClick={() => api?.scrollNext()} />
      </div>
      <div ref={ref} className="overflow-hidden">
        <ul className="-ml-4 flex touch-pan-y">
          {items.map((g) => (
            <li key={g.id} className="min-w-0 shrink-0 grow-0 basis-[78%] pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Link href={`/community/gallery/${g.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                  <SmartImage src={g.imageUrl} alt={g.title} fill sizes="(min-width:1024px) 280px, (min-width:640px) 45vw, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="mt-3 truncate text-[15.5px] font-bold text-ink group-hover:text-primary">{g.title}</p>
                <time dateTime={g.createdAt} className="text-[13px] text-muted">
                  {dates[g.id]}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ArrowButton({ dir, disabled, onClick }: { dir: "prev" | "next"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "이전 사진" : "다음 사진"}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition hover:border-primary hover:text-primary disabled:opacity-35 disabled:hover:border-line disabled:hover:text-ink"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
      </svg>
    </button>
  );
}
