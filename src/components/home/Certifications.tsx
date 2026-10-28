import Link from "next/link";
import { site } from "@/config/site";

/** 메인 인증·지정 스트립 — 신뢰도 표시 (상세는 /about/organization) */
export function Certifications() {
  return (
    <section aria-labelledby="certs-title" className="border-y border-line bg-white py-10">
      <div className="container-site">
        <div className="mb-5 flex items-center justify-between">
          <h2 id="certs-title" className="text-[15px] font-bold text-ink">인증 · 지정</h2>
          <Link href="/about/organization" className="text-[13.5px] font-medium text-muted hover:text-primary">
            자세히 보기 →
          </Link>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {site.certifications.map((c) => (
            <li key={c.name} className="rounded-2xl bg-surface px-4 py-4">
              <p className="text-[15px] font-bold text-primary">{c.short}</p>
              <p className="mt-1 text-[12.5px] leading-snug text-muted">{c.issuer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
