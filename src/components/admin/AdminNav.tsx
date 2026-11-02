"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const items = [
  { href: "/admin", label: "대시보드", match: (p: string) => p === "/admin" },
  { href: "/admin/posts?board=notice", label: "공지사항 관리", match: (p: string, b: string | null) => p.startsWith("/admin/posts") && b !== "press" },
  { href: "/admin/posts?board=press", label: "보도자료 관리", match: (p: string, b: string | null) => p.startsWith("/admin/posts") && b === "press" },
  { href: "/admin/gallery", label: "갤러리 관리", match: (p: string) => p.startsWith("/admin/gallery") },
];

export function AdminNav() {
  const pathname = usePathname();
  const board = useSearchParams().get("board");
  return (
    <nav aria-label="관리자 메뉴" className="overflow-x-auto px-3 pb-3 lg:pb-0">
      <ul className="flex gap-1 lg:flex-col">
        {items.map((it) => {
          const active = it.match(pathname, board);
          return (
            <li key={it.href} className="shrink-0">
              <Link
                href={it.href}
                aria-current={active ? "page" : undefined}
                className={`block rounded-md px-4 py-2.5 text-[15px] font-medium ${active ? "bg-green text-white" : "text-body hover:bg-cream"}`}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
