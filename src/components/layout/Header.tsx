import Link from "next/link";
import Image from "next/image";
import { mainMenu } from "@/config/menu";
import { site } from "@/config/site";
import { MobileMenu } from "./MobileMenu";

/** 상단 네비게이션 — 기존 레이아웃 유지 (75px · 1160px · 로고 / 메뉴 / 우측 버튼) */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#f3f4f6] bg-white">
      <div className="container-site flex h-[75px] items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} 홈`}>
          <Image src="/logo.png" alt={site.name} width={131} height={42} priority className="h-[42px] w-auto" />
        </Link>

        <nav aria-label="주 메뉴" className="hidden h-full lg:block">
          <ul className="flex h-full items-center gap-1 xl:gap-3">
            {mainMenu.map((item) => (
              <li key={item.href} className="group relative flex h-full items-center">
                <Link
                  href={item.href}
                  className="relative px-3 py-2 text-[16px] font-medium text-ink transition-colors after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:bg-primary after:transition-transform hover:text-primary group-hover:after:scale-x-100 group-focus-within:after:scale-x-100"
                >
                  {item.label}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-1/2 top-full -translate-x-1/2 translate-y-[-8px] pt-1 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                    <ul className="min-w-[180px] overflow-hidden rounded-[10px] border border-[#eaeaea] bg-white py-1 shadow-dropdown">
                      {item.children.map((child) => (
                        <li key={child.href} className="border-b border-[#f1f1f1] last:border-b-0">
                          <Link
                            href={child.href}
                            className="block whitespace-nowrap px-5 py-[11px] text-center text-[14px] font-medium text-ink/80 transition-colors hover:bg-primary-50 hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${site.contact.phone}`}
            className="hidden h-[42px] items-center gap-2 rounded-full bg-primary px-5 text-[14px] font-bold text-white shadow-[0_4px_12px_rgb(31_99_201/0.3)] transition hover:-translate-y-0.5 hover:bg-primary-dark sm:inline-flex"
          >
            <PhoneIcon />
            교육문의 {site.contact.phone}
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}
