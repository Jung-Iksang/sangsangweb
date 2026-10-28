"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { findSection, mainMenu } from "@/config/menu";

/** 현재 경로의 1차 메뉴에 초록 밑줄 표시 */
export function ActiveNav() {
  const pathname = usePathname();
  const active = findSection(pathname)?.section.href ?? null;
  return <NavList active={active} />;
}

export function NavList({ active }: { active: string | null }) {
  return (
    <ul className="flex h-full items-center gap-2 xl:gap-5">
      {mainMenu.map((item) => {
        const isActive = active === item.href;
        return (
          <li key={item.href} className="group relative flex h-full items-center">
            <Link
              href={item.href}
              aria-current={isActive ? "true" : undefined}
              className={`relative flex h-full items-center px-2.5 text-[16px] font-semibold text-ink after:absolute after:inset-x-2.5 after:bottom-0 after:h-[2px] after:origin-left after:bg-green after:transition-transform after:duration-300 ${
                isActive ? "after:scale-x-100" : "after:scale-x-0 group-hover:after:scale-x-100 group-focus-within:after:scale-x-100"
              }`}
            >
              {item.label}
            </Link>
            {item.children && (
              <div className="invisible absolute left-0 top-full -translate-y-1 pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <ul className="min-w-[200px] rounded-md border border-line bg-paper p-1.5 shadow-dropdown">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className="block whitespace-nowrap rounded-sm px-3.5 py-2.5 text-[14.5px] font-medium text-ink transition-colors hover:bg-cream hover:text-green"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
