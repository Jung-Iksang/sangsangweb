import Image from "next/image";
import Link from "next/link";
import { SubPage } from "@/components/layout/SubPage";
import { careerCards, careerCredentials, careerSchools } from "@/content/career";
import { photos } from "@/content/photos.generated";
import { programs } from "@/content/programs";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "진로·직업체험",
  description:
    "교육부 인증 교육기부 진로체험기관 상상마루의 진로·직업체험. 드론·3D프린터·코딩·VR/AR·로봇·IoT 6개 미래기술 스쿨과 찾아가는 진로체험, 창업체험을 운영합니다.",
  path: "/career",
  keywords: ["진로체험", "직업체험", "교육기부 진로체험기관", "익산 진로체험", "찾아가는 진로체험", "4차산업 진로체험"],
});

export default function Page() {
  return (
    <SubPage path="/career" title="진로·직업체험" description="진로가 미래다! 아이들을 꿈의 시대 주인공으로 키웁니다.">
      <div className="space-y-16">
        <section aria-labelledby="credentials">
          <h2 id="credentials" className="mb-6 text-[24px] font-bold text-ink">믿을 수 있는 진로체험기관</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {careerCredentials.map((c) => {
              const img = photos[c.photo];
              return (
                <li key={c.title} className="flex gap-4 rounded-card border border-line p-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface">
                    <Image src={img.src} alt={c.title} fill sizes="96px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink">{c.title}</h3>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted">{c.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="schools">
          <h2 id="schools" className="mb-2 text-[24px] font-bold text-ink">세상을 바꾸는 미래기술 6개 스쿨</h2>
          <p className="mb-6 text-muted">미래 기술을 직접 만들고 조종하며 그 분야의 직업을 알아봅니다.</p>
          <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {careerSchools.map((s) => (
              <li key={s.no} className="overflow-hidden rounded-card border border-line">
                <div className="border-t-[6px] px-6 pb-2 pt-5" style={{ borderColor: s.color }}>
                  <span className="text-[13px] font-bold text-muted">미래기술 {s.no} · {s.tech}</span>
                  <h3 className="mt-1 text-[22px] font-bold text-ink">{s.name}</h3>
                  <p className="text-[14px] text-body">{s.tagline}</p>
                </div>
                <div className="px-6 pb-6 pt-3">
                  <p className="text-[14.5px] leading-relaxed text-body">{s.desc}</p>
                  <p className="mt-3 text-[13px] text-muted">{s.tags.map((t) => `#${t}`).join(" ")}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link href="/experience/school" className="mt-5 inline-flex font-bold text-primary hover:underline">
            진로체험 스쿨 자세히 보기 →
          </Link>
        </section>

        <section aria-labelledby="ways">
          <h2 id="ways" className="mb-6 text-[24px] font-bold text-ink">이렇게 체험해요</h2>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {careerCards.map((c) => {
              const img = photos[c.photo];
              return (
                <li key={c.title}>
                  <Link href={c.href} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-card">
                      <Image src={img.src} alt={c.title} fill sizes="(min-width:1024px) 220px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    </div>
                    <h3 className="mt-3 font-bold text-ink group-hover:text-primary">{c.title}</h3>
                    <p className="text-[13.5px] text-muted">{c.desc}</p>
                  </Link>
                </li>
              );
            })}
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
