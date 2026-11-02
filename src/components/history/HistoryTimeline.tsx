"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { chronological, type HistoryEntry } from "@/lib/history";
import { useReducedMotion } from "@/components/ui/useReducedMotion";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import "./HistoryTimeline.css";

export function HistoryTimeline({ entries, compact = false }: { entries: readonly HistoryEntry[]; compact?: boolean }) {
  const ordered = useMemo(() => chronological(entries), [entries]);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const current = ordered[active] ?? ordered[0];

  useEffect(() => {
    if (compact) return;
    const rows = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-history-row]") ?? []);
    let frame = 0;
    const update = () => {
      frame = 0;
      const marker = window.innerHeight * .38;
      let next = 0;
      rows.forEach((row, index) => { if (row.getBoundingClientRect().top <= marker) next = index; });
      setActive(next);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, [compact, ordered]);

  const select = (index: number) => {
    setActive(index);
    root.current?.querySelector<HTMLElement>(`[data-year-button="${index}"]`)?.scrollIntoView({
      behavior: reducedMotion ? "instant" : "smooth", block: "nearest", inline: "nearest",
    });
  };

  if (!current) return null;

  if (compact) return (
    <div ref={root} className="history-compact">
      <div className="history-heading">
        <div><p className="section-kicker">상상마루의 발자취</p><h3>배움으로 이어 온 시간</h3></div>
        <Link href="/about/history" className="link-more">전체 연혁 <span aria-hidden>→</span></Link>
      </div>
      <div className="history-compactBody">
        <nav className="history-years" aria-label="연혁 연도 선택">
          <ol>{ordered.map((entry, index) => <li key={entry.year}>
            <button type="button" data-year-button={index} aria-current={index === active ? "date" : undefined}
              aria-controls="home-history-detail" onClick={() => select(index)}>{entry.year}</button>
          </li>)}</ol>
        </nav>
        <div id="home-history-detail" className="history-detail" aria-live="polite" aria-atomic="true">
          <div key={current.year} className="history-detailCopy"><p className="history-detailYear">{current.year}<span>년</span></p>
            <ul>{current.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div className="history-stepControls">
            <button type="button" aria-label="이전 연혁" disabled={active === 0} onClick={() => select(active - 1)}>←</button>
            <span>{active + 1} / {ordered.length}</span>
            <button type="button" aria-label="다음 연혁" disabled={active === ordered.length - 1} onClick={() => select(active + 1)}>→</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div ref={root} className="history-timeline">
      <p className="history-intro">{ordered[0].year}년부터 {ordered[ordered.length - 1].year}년까지, 상상마루가 걸어온 길</p>
      <ScrollReveal><ol>{ordered.map((entry, index) => (
        <li key={entry.year} data-history-row data-reveal-item data-active={index === active} data-passed={index < active} className="history-row">
          <h2><a href={`#history-${entry.year}`} aria-current={index === active ? "date" : undefined}>{entry.year}<span>년</span></a></h2>
          <span className="history-point" aria-hidden="true" />
          <div id={`history-${entry.year}`} className="history-events">
            <ul>{entry.items.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </li>
      ))}</ol></ScrollReveal>
    </div>
  );
}
