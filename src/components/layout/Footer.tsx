import Link from "next/link";
import Image from "next/image";
import { mainMenu } from "@/config/menu";
import { site } from "@/config/site";
import { ScrollTopButton } from "./ScrollTopButton";

export function Footer() {
  return (
    <footer className="bg-ink text-on-ink">
      <div className="container-site pb-8 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image src="/logo.png" alt={site.name} width={125} height={40} className="h-10 w-auto" />
            <p className="mt-6 text-[15px] font-semibold text-on-ink">{site.slogan} · {site.tagline}</p>
            <address className="mt-4 space-y-1.5 text-[14px] not-italic leading-relaxed text-on-ink-muted">
              <p>{site.address.full}</p>
              <p>
                전화 <a href={`tel:${site.contact.phone}`} className="text-on-ink underline decoration-on-ink/35 underline-offset-4 hover:text-on-ink-green">{site.contact.phone}</a>
                <span className="mx-2 opacity-40">/</span>팩스 {site.contact.fax}
              </p>
              <p>
                이메일 <a href={`mailto:${site.contact.email}`} className="text-on-ink underline decoration-on-ink/35 underline-offset-4 hover:text-on-ink-green">{site.contact.email}</a>
              </p>
            </address>
          </div>

          <nav aria-label="바로가기">
            <h2 className="text-[13px] font-semibold text-on-ink-muted">바로가기</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[15px]">
              {mainMenu.map((m) => (
                <li key={m.href}>
                  <Link href={m.href} className="text-on-ink hover:text-on-ink-green">
                    {m.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/about/location" className="text-on-ink hover:text-on-ink-green">오시는 길</Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-[13px] font-semibold text-on-ink-muted">인증 · 지정</h2>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {site.certifications.map((c) => (
                <li key={c.name} className="flex items-baseline justify-between gap-3 border-b border-on-ink/10 pb-2.5">
                  <span className="text-on-ink">{c.short}</span>
                  <span className="text-[12px] text-on-ink-muted">{c.period.split(" ")[0]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-on-ink/15 pt-6 text-[12.5px] text-on-ink-muted md:flex-row md:items-center md:justify-between">
          <p className="leading-relaxed">
            {site.legalName} · 대표 {site.business.ceo} · 사업자등록번호 {site.business.registrationNo} · 법인등록번호{" "}
            {site.business.corporateNo} · 통신판매업신고 {site.business.mailOrderNo}
          </p>
          <div className="flex items-center gap-4">
            <p>ⓒ {site.legalName}</p>
            <Link href="/admin" rel="nofollow" className="hover:text-on-ink">
              관리자
            </Link>
            <ScrollTopButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
