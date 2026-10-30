"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function AboutIntroReveal({ children }: { children: ReactNode }) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-about-reveal]") ?? []);
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;

    const setup = () => {
      observer?.disconnect();
      if (motion.matches || !("IntersectionObserver" in window)) {
        elements.forEach((element) => { element.dataset.aboutReveal = "visible"; });
        return;
      }

      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.aboutReveal = "visible";
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });

      elements.forEach((element) => {
        if (element.dataset.aboutReveal === "visible") return;
        // Keep restored scroll positions readable; animate upcoming content once.
        if (element.getBoundingClientRect().bottom <= 0) {
          element.dataset.aboutReveal = "visible";
          return;
        }
        element.dataset.aboutReveal = "pending";
        observer?.observe(element);
      });
    };

    setup();
    motion.addEventListener("change", setup);
    return () => {
      observer?.disconnect();
      motion.removeEventListener("change", setup);
      elements.forEach((element) => { element.dataset.aboutReveal = ""; });
    };
  }, []);

  return (
    <section ref={root} aria-labelledby="about-title" className="about-intro"
      onFocusCapture={(event) => {
        const element = event.target.closest<HTMLElement>("[data-about-reveal]");
        if (element) element.dataset.aboutReveal = "visible";
      }}>
      {children}
    </section>
  );
}
