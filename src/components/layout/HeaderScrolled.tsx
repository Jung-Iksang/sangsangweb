"use client";

import { useEffect } from "react";

/** 페이지를 조금이라도 내리면 헤더에 data-scrolled="true" — 아래선 대신 옅은 그림자로 본문과 구분 */
export function HeaderScrolled() {
  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      header.dataset.scrolled = String(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
