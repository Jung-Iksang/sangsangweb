"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Content is readable before hydration and without JavaScript. */
export function ScrollReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const elements = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-reveal-item]") ?? []);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    const setup = () => {
      observer?.disconnect();
      if (motion.matches || !("IntersectionObserver" in window)) {
        elements.forEach((el) => { el.dataset.revealItem = "visible"; });
        return;
      }
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.revealItem = "visible";
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
      elements.forEach((el) => {
        if (el.dataset.revealItem === "visible" || el.getBoundingClientRect().top < window.innerHeight) {
          el.dataset.revealItem = "visible";
        } else {
          el.dataset.revealItem = "pending";
          observer?.observe(el);
        }
      });
    };
    setup();
    motion.addEventListener("change", setup);
    return () => { observer?.disconnect(); motion.removeEventListener("change", setup); };
  }, []);
  return <div ref={root} className={className} onFocusCapture={(event) => {
    const item = event.target.closest<HTMLElement>("[data-reveal-item]");
    if (item) item.dataset.revealItem = "visible";
  }}>{children}</div>;
}
