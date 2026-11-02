"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import localFont from "next/font/local";
import Image from "next/image";
import Link from "next/link";
import { photos } from "@/content/photos.generated";
import { useReducedMotion } from "@/components/ui/useReducedMotion";
import { site } from "@/config/site";
import "./Hero.css";

const heroInfoFont = localFont({
  src: "../../../public/fonts/hakgyoansim/HakgyoansimRikodeoOTFR.otf",
  display: "swap",
  preload: false,
});

const slides = [
  { src: photos["drone-class"].src, caption: "드론 체험 교육", position: "60% center", mobilePosition: "68% center" },
  { src: photos["hero-education"].src, caption: "창의공학실 코딩 교육", position: "65% center", mobilePosition: "70% center" },
  { src: photos["events-hanoi"].src, caption: "하노이탑대회 체험부스", position: "60% center", mobilePosition: "64% center" },
];

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [visible, setVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const running = !hovered && !focused && visible && !reducedMotion;

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((index) => (index + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [running]);

  const select = (index: number) => {
    setActive((index + slides.length) % slides.length);
  };

  return (
    <section ref={root} aria-labelledby="hero-title" className="hero-banner"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
      <div className="hero-layout">
        <div className="hero-media" role="region" aria-label="상상마루 교육 현장 사진" aria-roledescription="캐러셀">
          <div className="hero-visual">
            {slides.map((slide, index) => (
              <div key={slide.src} className="hero-slide" data-active={index === active} aria-hidden={index !== active}>
                <Image src={slide.src} alt={slide.caption} fill preload={index === 0}
                  sizes="(min-width:1500px) 940px, (min-width:1200px) 62vw, (min-width:800px) calc(100vw - 60px), calc(100vw - 30px)"
                  className="hero-image" style={{ "--hero-image-position": slide.position, "--hero-mobile-position": slide.mobilePosition } as CSSProperties} />
              </div>
            ))}
          </div>
          <p className="hero-caption" aria-live={running ? "off" : "polite"}>{slides[active].caption}</p>
          <div className="hero-bottom">
            <div className="hero-pagination">
              <span className="hero-counter"><strong>{String(active + 1).padStart(2, "0")}</strong><span>– {String(slides.length).padStart(2, "0")}</span></span>
            </div>
            <div className="hero-controls" role="group" aria-label="메인 비주얼 탐색">
              <button type="button" aria-label="이전 슬라이드" onClick={() => select(active - 1)}><Arrow reverse /></button>
              <button type="button" aria-label="다음 슬라이드" onClick={() => select(active + 1)}><Arrow /></button>
            </div>
          </div>
        </div>
        <div className="hero-copy">
          <div className="hero-copy-text">
            <h1 id="hero-title" className="hero-brand-title">
              <Image
                src="/photos/brand-calligraphy.png"
                alt="호기심 충전소"
                width={737}
                height={289}
                sizes="(min-width:1500px) 310px, (min-width:1200px) 24vw, (min-width:800px) 34vw, (min-width:600px) 310px, 75vw"
                loading="eager"
                className="hero-brand-image"
              />
            </h1>
            <p className="hero-brand-caption"><span>호기심이 배움으로</span><br />자라는 체험 공간</p>
          </div>
          <div className="hero-characters" aria-hidden="true">
            <Image
              src="/illustrations/hero-future-learning-v1.png"
              alt=""
              fill
              sizes="(min-width:1500px) 190px, (min-width:1200px) 15vw, (min-width:800px) 25vw, 42vw"
              className="hero-scene-image"
            />
          </div>
        </div>
        <div className="hero-info" aria-label="상상마루 교육 안내">
          <dl className={`hero-infoList ${heroInfoFont.className}`}>
            <div><dt>교육분야</dt><dd>진로·직업체험 · 창의융합교육</dd></div>
            <div><dt>교육문의</dt><dd><a href={`tel:${site.contact.phone}`}>{site.contact.phone}</a></dd></div>
            <div className="hero-location"><dt>위치안내</dt><dd className="hero-address">{site.address.locality} {site.address.street}</dd></div>
          </dl>
          <nav className="hero-quickLinks" aria-label="교육 안내 바로가기">
            <Link href="/experience/school"><QuickIcon kind="program" />프로그램</Link>
            <a href={`tel:${site.contact.phone}`}><QuickIcon kind="phone" />교육문의</a>
            <Link href="/about/location"><QuickIcon kind="map" />오시는 길</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}

function QuickIcon({ kind }: { kind: "program" | "phone" | "map" }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "program" ? <><path d="M12 5c-3-2-6-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-3-1-6-1-9 1zM12 5v15" /></> :
      kind === "map" ? <><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2zM9 3v16M15 5v16" /></> :
        <path d="m7 3 3 5-3 3c2 3 3 4 6 6l3-3 5 3v3c0 1-1 2-2 2C9 21 3 15 2 5c0-1 1-2 2-2z" />}
  </svg>;
}

function Arrow({ reverse = false }: { reverse?: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" style={{ rotate: reverse ? "180deg" : undefined }}><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
}
