"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** 헤더 로고: 다른 페이지에서는 홈으로, 홈에서는 맨 위로 부드럽게 스크롤 */
export function LogoLink({ label, children }: { label: string; children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <Link
      href="/"
      aria-label={label}
      className="flex shrink-0 items-center"
      onClick={(e) => {
        if (pathname === "/") {
          e.preventDefault();
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        }
      }}
    >
      {children}
    </Link>
  );
}
