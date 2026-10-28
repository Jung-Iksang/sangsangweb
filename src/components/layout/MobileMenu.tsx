"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mainMenu } from "@/config/menu";
import { site } from "@/config/site";

/** 1024px 이하 햄버거 메뉴 (아코디언) */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-full text-ink hover:bg-surface"
        aria-label="전체 메뉴 열기"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={close}
        aria-hidden
      />
      <nav
        id="mobile-menu"
        aria-label="모바일 메뉴"
        className={`fixed inset-y-0 right-0 z-[70] flex w-[86%] max-w-[360px] flex-col bg-white shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        inert={!open}
      >
        <div className="flex h-[75px] items-center justify-between border-b border-line px-5">
          <span className="text-lg font-bold text-ink">전체 메뉴</span>
          <button
            type="button"
            onClick={close}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-surface"
            aria-label="메뉴 닫기"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-2 py-2">
          {mainMenu.map((item) => {
            const isOpen = expanded === item.href;
            return (
              <li key={item.href} className="border-b border-[#f3f4f6]">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : item.href)}
                      className="flex w-full items-center justify-between px-3 py-4 text-left text-[16px] font-bold text-ink"
                      aria-expanded={isOpen}
                    >
                      {item.label}
                      <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <ul className={`grid overflow-hidden transition-all ${isOpen ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]"}`}>
                      <div className="min-h-0">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} onClick={close} className="block rounded-lg px-5 py-2.5 text-[15px] text-body hover:bg-primary-50 hover:text-primary">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </div>
                    </ul>
                  </>
                ) : (
                  <Link href={item.href} onClick={close} className="block px-3 py-4 text-[16px] font-bold text-ink">
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="border-t border-line p-5">
          <a href={`tel:${site.contact.phone}`} className="flex h-12 items-center justify-center rounded-full bg-primary font-bold text-white">
            교육문의 {site.contact.phone}
          </a>
        </div>
      </nav>
    </div>
  );
}
