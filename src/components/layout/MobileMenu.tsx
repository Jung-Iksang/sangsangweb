"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { mainMenu } from "@/config/menu";
import { site } from "@/config/site";

/** Smaller screens use an accordion drawer to keep 20px desktop labels clear. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => panel.current?.querySelector<HTMLButtonElement>("button")?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); trigger.current?.focus(); }
      if (e.key !== "Tab") return;
      const focusable = Array.from(panel.current?.querySelectorAll<HTMLElement>("a[href], button") ?? [])
        .filter((el) => !el.closest("[inert]"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    window.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onResize);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  const close = () => { setOpen(false); trigger.current?.focus(); };

  return (
    <div className="xl:hidden">
      <button
        ref={trigger}
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
      <div
        ref={panel}
        role="dialog"
        aria-modal={open ? true : undefined}
        id="mobile-menu"
        aria-label="모바일 메뉴"
        className={`fixed inset-y-0 right-0 z-[70] flex w-[86%] max-w-[23.75rem] flex-col bg-paper transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        inert={!open}
      >
        <div className="flex h-[var(--header-h)] items-center justify-between border-b border-line px-5">
          <span className="type-nav text-ink">전체 메뉴</span>
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
                      <span className="flex-1 type-nav text-ink">{item.label}</span>
                      <svg viewBox="0 0 24 24" className={`h-5 w-5 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    </button>
                    <div className={`grid overflow-hidden transition-all ${isOpen ? "grid-rows-[1fr] pb-3" : "grid-rows-[0fr]"}`}>
                      <ul className="min-h-0" inert={!isOpen}>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} onClick={close} className="block py-2.5 pl-9 type-menu-link text-body hover:text-green">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link href={item.href} onClick={close} className="flex items-center gap-3 py-4">
                    <span className="num">{no}</span>
                    <span className="type-nav text-ink">{item.label}</span>
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
      </div>
    </div>
  );
}
