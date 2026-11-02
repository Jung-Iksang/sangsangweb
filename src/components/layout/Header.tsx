import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { site } from "@/config/site";
import { MobileMenu } from "./MobileMenu";
import { ActiveNav, NavList } from "./MainNav";
import { LogoLink } from "./LogoLink";
import { HeaderScrolled } from "./HeaderScrolled";
import "./Header.css";

/** 기관 안내 48px + 주 메뉴 78px. --header-h는 두 단의 전체 높이입니다. */
export function Header() {
  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 overflow-x-clip border-b border-line bg-paper transition-shadow data-[scrolled=true]:border-transparent data-[scrolled=true]:shadow-[0_1px_0_var(--color-line),0_6px_16px_rgb(31_30_28/0.04)]"
    >
      <HeaderScrolled />
      <div className="site-utility">
        <div className="site-header-frame site-utility-inner">
          <p className="site-utility-brand"><span>{site.legalName}</span><span className="site-utility-message">{site.slogan}</span></p>
          <nav aria-label="기관 안내 바로가기" className="site-utility-links">
            <Link href="/community/notice">공지사항</Link>
            <Link href="/about/location">오시는 길</Link>
            <a href={`tel:${site.contact.phone}`}>교육문의 <span>{site.contact.phone}</span></a>
          </nav>
        </div>
      </div>
      <div className="site-header-frame site-navigation-row flex items-center justify-between gap-6">
        <Suspense
          fallback={
            <Link href="/" className="flex shrink-0 items-center" aria-label={`${site.name} 홈`}>
              <Image src="/logo.png" alt={site.name} width={150} height={48} loading="eager" className="site-brand-logo object-contain" />
            </Link>
          }
        >
          <LogoLink label={`${site.name} 홈`}>
            <Image src="/logo.png" alt={site.name} width={150} height={48} loading="eager" className="site-brand-logo object-contain" />
          </LogoLink>
        </Suspense>

        <nav aria-label="주 메뉴" className="site-main-nav hidden h-full xl:block">
          <Suspense fallback={<NavList active={null} />}>
            <ActiveNav />
          </Suspense>
        </nav>

        <div className="flex items-center gap-2">
          <a href={`tel:${site.contact.phone}`} className="site-header-contact btn btn-outline hidden sm:inline-flex">
            <PhoneIcon />
            <span>문의 {site.contact.phone}</span>
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

