import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { site } from "@/config/site";

export function AboutIntro() {
  const facts = [
    { k: `${site.foundingYear}`, v: "설립 · 진로·직업체험 교육 전문" },
    { k: "10+", v: "교육·체험 프로그램 운영" },
    { k: "전북 익산", v: "원광대학교 프라임관 소재" },
  ];
  return (
    <section aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="container-site grid items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <div>
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.18em] text-primary">About us</p>
          <h2 id="about-title" className="text-[28px] font-bold leading-[1.35] text-ink md:text-[38px]">
            꿈을 상상하고,
            <br />
            미래를 <span className="text-primary">체험</span>하는 곳
          </h2>
          <p className="mt-6 text-[16px] leading-[1.85] text-body md:text-[17px]">
            상상마루는 학생들의 진로·직업체험 교육을 전문으로 하는 교육 플랫폼입니다. 학생들이 다양한 직업 세계를 경험하고,
            자신의 적성과 흥미를 발견할 수 있도록 학교·지역사회와 함께 체계적인 프로그램을 제공합니다.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-3">
            {facts.map((f) => (
              <div key={f.v} className="rounded-2xl border border-line bg-white p-4">
                <dt className="sr-only">{f.v}</dt>
                <dd className="text-[20px] font-bold text-ink md:text-[24px]">{f.k}</dd>
                <dd className="mt-1 text-[12.5px] leading-snug text-muted md:text-[13.5px]">{f.v}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about/greeting" className="mt-8 inline-flex items-center gap-2 font-bold text-primary hover:gap-3 transition-all">
            단체소개 자세히 보기 <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="relative">
          <div aria-hidden className="absolute -left-4 -top-4 h-24 w-24 rounded-[22px] bg-brand-yellow/30" />
          <div aria-hidden className="absolute -bottom-5 -right-3 h-28 w-28 rounded-[26px] bg-brand-green/25" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-card">
            <SmartImage src="/mock/about.svg" alt="상상마루 교육 현장" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
