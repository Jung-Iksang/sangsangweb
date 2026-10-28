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
        className="flex h-11 w-11 items-center justify-center rounded-sm text-ink hover:bg-cream"
        aria-label="전체 메뉴 열기"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={close}
        aria-hidden
      />
      <nav
        id="mobile-menu"
        aria-label="모바일 메뉴"
        className={`fixed inset-y-0 right-0 z-[70] flex w-[86%] max-w-[380px] flex-col bg-paper transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        inert={!open}
      >
        <div className="flex h-[var(--header-h)] items-center justify-between border-b border-line px-5">
          <span className="text-[17px] font-bold text-ink">전체 메뉴</span>
          <button
            type="button"
            onClick={close}
            className="flex h-11 w-11 items-center justify-center rounded-sm hover:bg-cream"
            aria-label="메뉴 닫기"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto px-5">
          {mainMenu.map((item, i) => {
            const isOpen = expanded === item.href;
            const no = String(i + 1).padStart(2, "0");
            return (
              <li key={item.href} className="border-b border-line">
                {item.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : item.href)}
                      className="flex w-full items-center gap-3 py-4 text-left"
                      aria-expanded={isOpen}
                    >
                      <span className="num">{no}</span>
                      <span className="flex-1 text-[18px] font-bold text-ink">{item.label}</span>
                      <svg viewBox="0 0 24 24" className={`h-5 w-5 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <ul className={`grid overflow-hidden transition-all ${isOpen ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]"}`}>
                      <div className="min-h-0">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} onClick={close} className="block py-2.5 pl-9 text-[15px] text-body hover:text-green">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </div>
                    </ul>
                  </>
                ) : (
                  <Link href={item.href} onClick={close} className="flex items-center gap-3 py-4">
                    <span className="num">{no}</span>
                    <span className="text-[18px] font-bold text-ink">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
        <div className="border-t border-line p-5">
          <a href={`tel:${site.contact.phone}`} className="btn btn-primary w-full">
            교육문의 {site.contact.phone}
          </a>
        </div>
      </nav>
    </div>
  );
}
