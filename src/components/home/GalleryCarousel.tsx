"use client";

import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useRef, useState } from "react";
import { SmartImage } from "@/components/ui/SmartImage";
import { NewsControlIcon } from "./NewsControlIcon";
import type { GalleryCard } from "@/lib/data";

export function GalleryCarousel({ items, dates }: { items: GalleryCard[]; dates: Record<number, string> }) {
  const [ref, api] = useEmblaCarousel({ align: "start", loop: items.length > 2 });
  const root = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const canPlay = canPrev || canNext;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    const frame = requestAnimationFrame(update);
    media.addEventListener("change", update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => { cancelAnimationFrame(frame); media.removeEventListener("change", update); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!api) return;
    const update = () => { setCanPrev(api.canScrollPrev()); setCanNext(api.canScrollNext()); };
    const frame = requestAnimationFrame(update);
    const stop = () => setPaused(true);
    api.on("select", update).on("reInit", update).on("pointerDown", stop);
    return () => { cancelAnimationFrame(frame); api.off("select", update).off("reInit", update).off("pointerDown", stop); };
  }, [api]);

  useEffect(() => {
    if (!api || !canPlay || paused || reducedMotion || hovered || focused || !visible) return;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (api.canScrollNext()) api.scrollNext();
      else api.scrollTo(0);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [api, canPlay, paused, reducedMotion, hovered, focused, visible]);

  const move = (direction: "prev" | "next") => {
    setPaused(true);
    if (direction === "prev") api?.scrollPrev();
    else api?.scrollNext();
  };

  return (
    <section ref={root} aria-labelledby="gallery-title" className="news-gallery"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="news-panel-head">
        <h2 id="gallery-title"><Link href="/community/gallery">갤러리</Link></h2>
        <div className="news-controls">
          <button type="button" className="news-control" aria-label="이전 사진" aria-controls="news-gallery-slides" disabled={!canPrev} onClick={() => move("prev")}><NewsControlIcon kind="prev" /></button>
          {!reducedMotion && <button type="button" className="news-control" aria-label={paused ? "갤러리 자동재생 시작" : "갤러리 자동재생 정지"} aria-controls="news-gallery-slides" disabled={!canPlay} onClick={() => setPaused(!paused)}><NewsControlIcon kind={paused ? "play" : "pause"} /></button>}
          <button type="button" className="news-control" aria-label="다음 사진" aria-controls="news-gallery-slides" disabled={!canNext} onClick={() => move("next")}><NewsControlIcon kind="next" /></button>
        </div>
      </div>
      {items.length === 0 ? <p className="news-empty">등록된 사진이 없습니다.</p> : (
        <div ref={ref} className="news-gallery-viewport" id="news-gallery-slides" role="region" aria-label="교육 현장 사진" aria-roledescription="캐러셀">
          <ul className="news-gallery-track">
            {items.map((item) => (
              <li key={item.id} className="news-gallery-slide">
                <Link href={`/community/gallery/${item.id}`} className="news-gallery-card" onFocus={() => { setPaused(true); api?.scrollTo(items.indexOf(item)); }}>
                  <div className="news-gallery-image">
                    <SmartImage src={item.imageUrl} alt={item.title} fill sizes="(min-width:2520px) 550px, (min-width:901px) 23vw, (min-width:601px) 45vw, 85vw" className="object-cover" />
                  </div>
                  <h3>{item.title}</h3>
                  <time dateTime={item.createdAt}>{dates[item.id]}</time>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
