"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { findSection, mainMenu } from "@/config/menu";

/** 현재 경로의 1차 메뉴에 초록 밑줄 표시 */
export function ActiveNav() {
  const pathname = usePathname();
  const active = findSection(pathname)?.section.href ?? null;
  return <NavList active={active} />;
}

/** Equal menu cells; the header owns the navigation typography. */
const CELL = "clamp(6.5rem, 9vw, 8.75rem)";
/** 마우스가 메뉴 밖으로 나간 뒤 닫힐 때까지 기다리는 시간 — 대각선으로 움직일 때 깜빡임 방지 */
const CLOSE_DELAY = 150;

/**
 * 1차 메뉴 + 메가메뉴
 * - 1차 칸: 폭 고정 · 글자 가운데 · 헤더 높이 전체가 링크
 * - 2행 grid: 1행 1차 링크, 2행 하위 목록(각 칸 subgrid) + 전폭 배경판. 가장 긴 목록에 맞춰 모든 칸 높이가 같다
 * - 여닫기는 JS 상태: 마우스 들어오면 열고, 나가면 잠깐 뒤 닫음. 키보드 포커스로 열고 Esc·링크 클릭으로 닫음
 * - ul 높이는 주 메뉴 높이(--navigation-header-h)로 고정, 각 칸(li)은 마우스를 무시하고 링크·하위 목록만 반응
 *   → 닫혀 있을 때 헤더 아래로 넘친 칸 영역이 본문 마우스·클릭을 가로채지 않음
 */
export function NavList({ active }: { active: string | null }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = (delay = CLOSE_DELAY) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), delay);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const vis = open ? "visible opacity-100" : "invisible opacity-0";

  return (
    <ul
      className="grid h-full grid-rows-[var(--navigation-header-h)_auto]"
      style={{ gridTemplateColumns: `repeat(${mainMenu.length}, ${CELL})` }}
      onMouseEnter={show}
      onMouseLeave={() => hide()}
      onFocus={(e) => {
        if (e.target.matches(":focus-visible")) show();
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hide(0);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          window.clearTimeout(timer.current);
          setOpen(false);
        }
      }}
      onClick={(e) => {
        if ((e.target as Element).closest("a")) {
          window.clearTimeout(timer.current);
          setOpen(false);
        }
      }}
    >
      {/* 전폭 흰 배경판 (헤더의 overflow-x: clip 으로 화면 폭에 맞춰 잘림) */}
      <li
        aria-hidden
        role="presentation"
        className={`-mx-[100vw] border-b border-line bg-paper shadow-dropdown transition-[opacity,visibility] duration-150 ${vis}`}
        style={{ gridColumn: "1 / -1", gridRow: 2 }}
      />
      {mainMenu.map((item, n) => {
        const isActive = active === item.href;
        const children = item.children ?? [{ label: item.label, href: item.href }];
        return (
          <li
            key={item.href}
            className="group/item pointer-events-none grid grid-rows-subgrid"
            style={{ gridColumn: n + 1, gridRow: "1 / span 2" }}
          >
            <Link
              href={item.href}
              aria-current={isActive ? "true" : undefined}
              aria-expanded={open}
              aria-controls={`site-submenu-${n}`}
              className="pointer-events-auto flex items-center justify-center whitespace-nowrap type-nav text-ink"
            >
              <span
                className={`relative flex h-full items-center after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:origin-left after:bg-green after:transition-transform after:duration-300 ${
                  isActive ? "after:scale-x-100" : "after:scale-x-0 group-hover/item:after:scale-x-100 group-focus-within/item:after:scale-x-100"
                }`}
              >
                {item.label}
              </span>
            </Link>
            <ul id={`site-submenu-${n}`} className={`pointer-events-auto py-6 transition-[opacity,visibility,background-color] duration-150 group-hover/item:bg-cream ${vis}`}>
              {children.map((child) => (
                <li key={child.href}>
                  <Link
                    href={child.href}
                    className="block text-balance px-2 py-2 text-center type-menu-link text-body decoration-green underline-offset-4 hover:text-ink hover:underline"
                  >
                    {child.label}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}
