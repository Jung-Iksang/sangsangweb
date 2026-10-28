"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { CarouselArrow } from "@/components/ui/CarouselArrow";
import { SectionHead } from "./SectionHead";
import type { GalleryCard } from "@/lib/data";

/** 포토갤러리 섹션 머리 + 가로 캐러셀 — 서버에서 받은 목록을 그대로 보여주고, 머리 오른쪽 화살표로 스크롤 */
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
      <SectionHead
        no="05"
        id="gallery-title"
        title="포토갤러리"
        desc="상상마루 교육 현장의 순간들"
        moreHref="/community/gallery"
        actions={
          <>
            <CarouselArrow dir="prev" label="사진" disabled={!canPrev} onClick={() => api?.scrollPrev()} />
            <CarouselArrow dir="next" label="사진" disabled={!canNext} onClick={() => api?.scrollNext()} />
          </>
        }
      />
      {/* 위아래 여백: hover 로 떠오른 사진·그림자가 잘리지 않게 (바깥 배치는 그대로) */}
      <div ref={ref} className="-mb-8 -mt-3 overflow-hidden pb-8 pt-3">
        <ul className="-ml-4 flex touch-pan-y">
          {items.map((g) => (
            <li key={g.id} className="min-w-0 shrink-0 grow-0 basis-[78%] pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 2xl:basis-1/5">
              <Link href={`/community/gallery/${g.id}`} className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-line transition-[translate,box-shadow] duration-300 ease-out group-hover:shadow-lift group-focus-visible:shadow-lift motion-safe:group-hover:-translate-y-1.5 motion-safe:group-focus-visible:-translate-y-1.5">
                  <SmartImage src={g.imageUrl} alt={g.title} fill sizes="(min-width:1536px) 20vw, (min-width:1024px) 25vw, (min-width:640px) 45vw, 78vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                </div>
                <p className="mt-4 truncate text-[15px] font-bold text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">{g.title}</p>
                <time dateTime={g.createdAt} className="text-[13px] tabular-nums text-muted">
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

