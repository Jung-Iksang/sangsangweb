import Link from "next/link";
import { site } from "@/config/site";

/** 인증·지정 띠 — 가는 선으로 나눈 한 줄 (상세는 /about/organization) */
export function CertStrip() {
  return (
    <section aria-labelledby="certs-title" className="border-y border-line">
      <div className="container-site flex flex-col gap-5 py-8 lg:flex-row lg:items-center lg:gap-10">
        <div className="flex items-center justify-between lg:block lg:shrink-0">
          <h2 id="certs-title" className="text-[0.875rem] font-bold text-ink">인증 · 지정</h2>
          <Link href="/about/organization" className="link-more lg:hidden">인증 현황 보기</Link>
        </div>
        <ul className="grid flex-1 grid-cols-2 gap-y-4 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x lg:divide-line">
          {site.certifications.map((c) => (
            <li key={c.name} className="lg:px-5 lg:first:pl-0">
              <p className="text-[0.9375rem] font-bold text-ink">{c.short}</p>
              <p className="mt-0.5 text-[0.75rem] leading-snug text-muted">{c.issuer.replace(/\s*\(.*\)$/, "")}</p>
            </li>
          ))}
        </ul>
        <Link href="/about/organization" className="link-more hidden lg:inline">인증 현황 보기</Link>
      </div>
    </section>
  );
}
