import Link from "next/link";
import { SubPage } from "@/components/layout/SubPage";
import { SmartImage } from "@/components/ui/SmartImage";
import { careerCards, careerSteps } from "@/content/career";
import { programs } from "@/content/programs";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "진로·직업체험",
  description:
    "흥미 발견부터 직업 이해, 현장 체험, 전문가 멘토링, 진로 설계까지. 상상마루의 6단계 진로·직업체험 교육을 소개합니다.",
  path: "/career",
  keywords: ["진로체험", "직업체험", "진로교육 프로그램", "학교 진로체험", "익산 직업체험"],
});

export default function Page() {
  return (
    <SubPage
      path="/career"
      title="진로·직업체험"
      description="학생 한 명 한 명의 진로 여정을 발견에서 성장까지 여섯 단계로 함께합니다."
    >
      <div className="space-y-16">
        <section aria-labelledby="steps">
          <h2 id="steps" className="mb-6 text-[24px] font-bold text-ink">6단계 진로 동행</h2>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careerSteps.map((s) => (
              <li key={s.no} className="rounded-card border border-line p-6">
                <span className="text-[14px] font-bold text-primary">STEP {s.no}</span>
                <h3 className="mt-1 text-[22px] font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{s.desc}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="ways">
          <h2 id="ways" className="mb-6 text-[24px] font-bold text-ink">이렇게 체험해요</h2>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {careerCards.map((c) => (
              <li key={c.title}>
                <Link href={c.href} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-card">
                    <SmartImage src={c.image} alt={c.title} fill sizes="(min-width:1024px) 220px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-3 font-bold text-ink group-hover:text-primary">{c.title}</h3>
                  <p className="text-[13.5px] text-muted">{c.desc}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="all-programs">
          <h2 id="all-programs" className="mb-6 text-[24px] font-bold text-ink">연계 프로그램</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {programs.map((p) => (
              <li key={p.slug}>
                <Link href={`/${p.category}/${p.slug}`} className="group flex items-center justify-between rounded-2xl border border-line px-5 py-4 transition hover:border-primary/50">
                  <span className="font-medium text-ink group-hover:text-primary">{p.title}</span>
                  <span aria-hidden className="text-muted group-hover:text-primary">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="rounded-card bg-primary-50 p-6 text-center text-[16px] text-body">
          학교·기관 맞춤 진로체험 상담 <a href={`tel:${site.contact.phone}`} className="font-bold text-primary">{site.contact.phone}</a>
        </p>
      </div>
    </SubPage>
  );
}
