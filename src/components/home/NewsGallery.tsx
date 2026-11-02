"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { CarouselArrow } from "@/components/ui/CarouselArrow";
import type { GalleryCard } from "@/lib/data";
import { MoreButton } from "./MoreButton";

/** 소식 섹션 오른쪽 열: 포토갤러리 머리(‹ › +) + 사진 카드 2장씩 가로 캐러셀 */
export function NewsGallery({ items, dates }: { items: GalleryCard[]; dates: Record<number, string> }) {
  const [ref, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
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
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-4 pb-5">
        <h3 className="text-[24px] font-bold text-ink">포토갤러리</h3>
        <div className="flex gap-2">
          {items.length > 0 && (
            <>
              <CarouselArrow dir="prev" label="사진" disabled={!canPrev} onClick={() => api?.scrollPrev()} />
              <CarouselArrow dir="next" label="사진" disabled={!canNext} onClick={() => api?.scrollNext()} />
            </>
          )}
          <MoreButton href="/community/gallery" label="포토갤러리" />
        </div>
      </div>
      {items.length === 0 ? (
        <p className="border-t-2 border-ink py-12 text-[16px] text-muted">등록된 사진이 없습니다.</p>
      ) : (
        // 위아래 여백: hover 로 떠오른 사진·그림자가 잘리지 않게
        <div ref={ref} className="-mb-8 overflow-hidden border-t-2 border-ink pb-8 pt-6">
          <ul className="-ml-5 flex touch-pan-y">
            {items.map((g) => (
              <li key={g.id} className="min-w-0 shrink-0 grow-0 basis-[78%] pl-5 sm:basis-1/2">
                <Link href={`/community/gallery/${g.id}`} className="group block">
                  <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-line transition-[translate,box-shadow] duration-300 ease-out group-hover:shadow-lift group-focus-visible:shadow-lift motion-safe:group-hover:-translate-y-1.5 motion-safe:group-focus-visible:-translate-y-1.5">
                    <SmartImage
                      src={g.imageUrl}
                      alt={g.title}
                      fill
                      sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 78vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                    {g.imageCount > 1 && (
                      <span className="absolute right-2 top-2 rounded-sm bg-ink/85 px-1.5 py-0.5 text-[13px] font-semibold tabular-nums text-white">
                        {g.imageCount}장
                      </span>
                    )}
                  </div>
                  <p className="mt-4 line-clamp-2 min-h-[2.8em] text-[17px] font-semibold leading-[1.4] text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
                    {g.title}
                  </p>
                  <time dateTime={g.createdAt} className="mt-1.5 block text-[14px] tabular-nums text-muted">
                    {dates[g.id]}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
