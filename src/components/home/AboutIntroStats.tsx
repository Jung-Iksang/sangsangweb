"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { chronological } from "@/lib/history";

type Fact = { n: number; suffix: string; v: string };

/** Advance whole year/achievement pairs in chronological order while visible. */
export function AboutIntroStats({ history, facts }: {
  history: readonly { year: number; text: string }[];
  facts: readonly Fact[];
}) {
  const entries = useMemo(() => chronological(history), [history]);
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const current = entries[index] ?? entries[0];
  const running = visible;

  useEffect(() => {
    const grid = root.current?.closest(".about-intro-grid");
    const photo = grid?.querySelector<HTMLElement>(".about-intro-photo");
    const factsList = root.current?.querySelector<HTMLElement>(".about-intro-facts");
    if (!grid || !photo || !factsList) return;

    const trimDividers = () => {
      const factsBounds = factsList.getBoundingClientRect();
      const available = photo.getBoundingClientRect().bottom - factsBounds.top;
      const height = available > 0 ? Math.min(available, factsBounds.height) : factsBounds.height;
      factsList.style.setProperty("--about-divider-height", `${height}px`);
    };
    const observer = new ResizeObserver(trimDividers);
    observer.observe(grid);
    observer.observe(photo);
    trimDividers();
    grid.addEventListener("transitionend", trimDividers);
    void document.fonts.ready.then(() => { if (root.current) trimDividers(); });
    return () => {
      observer.disconnect();
      grid.removeEventListener("transitionend", trimDividers);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: .15 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!running || entries.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((value) => (value + 1) % entries.length);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [running, entries.length]);

  return (
    <div ref={root} className="about-intro-stats" data-reveal-item>
      <dl className="about-intro-facts">
        {current && <div className="about-intro-year" aria-live={running ? "off" : "polite"} aria-atomic="true">
          <dt className="sr-only">연혁</dt>
          <dd className="about-intro-value"><span key={current.year} className="about-intro-history-step">{current.year}</span><span className="about-intro-unit">년</span></dd>
          <dd className="about-intro-history-text"><span key={current.year} className="about-intro-history-step">{current.text}</span></dd>
        </div>}
        {facts.map((fact) => <div key={fact.suffix}>
          <dt>{fact.v}</dt>
          <dd className="about-intro-value">{fact.n}<span className="about-intro-unit">{fact.suffix}</span></dd>
        </div>)}
      </dl>
    </div>
  );
}
