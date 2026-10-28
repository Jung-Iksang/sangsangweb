import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { site } from "@/config/site";
import { MobileMenu } from "./MobileMenu";
import { ActiveNav, NavList } from "./MainNav";
import { LogoLink } from "./LogoLink";

/** 상단 네비게이션 — 75px · 1160px · 로고 / 메뉴 / 문의 버튼 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <div className="container-site flex h-[75px] items-center justify-between gap-6">
        <Suspense
          fallback={
            <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} 홈`}>
              <Image src="/logo.png" alt={site.name} width={131} height={42} priority className="h-[40px] w-auto" />
            </Link>
          }
        >
          <LogoLink label={`${site.name} 홈`}>
            <Image src="/logo.png" alt={site.name} width={131} height={42} priority className="h-[40px] w-auto" />
          </LogoLink>
        </Suspense>

        <nav aria-label="주 메뉴" className="hidden h-full lg:block">
          <Suspense fallback={<NavList active={null} />}>
            <ActiveNav />
          </Suspense>
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${site.contact.phone}`} className="btn btn-sm btn-outline hidden sm:inline-flex">
            <PhoneIcon />
            문의 {site.contact.phone}
          </a>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

export function PhoneIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
      />
    </svg>
  );
}
