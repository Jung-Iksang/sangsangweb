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
      <div className="space-y-20">
        <Block no="01" id="credentials" title="믿을 수 있는 진로체험기관">
          <ul className="grid border-t border-ink sm:grid-cols-2 sm:gap-x-10">
            {careerCredentials.map((c) => {
              const img = photos[c.photo];
              return (
                <li key={c.title} className="flex gap-5 border-b border-line py-5">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-line bg-white">
                    <Image src={img.src} alt={c.title} fill sizes="80px" className="object-cover" />
                  </div>
                  <div>
                    <h3 className="text-[1.03125rem] font-bold text-ink">{c.title}</h3>
                    <p className="mt-1 text-[0.875rem] leading-relaxed text-muted">{c.desc}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </Block>

        <Block no="02" id="schools" title="세상을 바꾸는 미래기술 6개 스쿨" desc="미래 기술을 직접 만들고 조종하며 그 분야의 직업을 알아봅니다.">
          <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {careerSchools.map((s) => (
              <li key={s.no} id={`school-${s.no}`} className="scroll-mt-28 border-t-2 pt-5" style={{ borderColor: s.color }}>
                <p className="text-[0.8125rem] font-semibold tabular-nums text-muted">
                  {s.no} · {s.tech}
                </p>
                <h3 className="mt-1.5 text-[1.3125rem] font-bold tracking-tight text-ink">{s.name}</h3>
                <p className="type-small mt-1 font-medium text-body">{s.tagline}</p>
                <p className="type-body mt-4 text-body">{s.desc}</p>
                <p className="mt-3 text-[0.8125rem] text-muted">{s.tags.map((t) => `#${t}`).join(" ")}</p>
              </li>
            ))}
          </ol>
          <Link href="/experience/school" className="btn btn-ghost mt-10 text-[1rem]">
            진로체험 스쿨 자세히 보기 <span aria-hidden>→</span>
          </Link>
        </Block>

        <Block no="03" id="ways" title="이렇게 체험해요">
          <ul className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
            {careerCards.map((c) => {
              const img = photos[c.photo];
              return (
                <li key={c.title}>
                  <Link href={c.href} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-line">
                      <Image src={img.src} alt={c.title} fill sizes="(min-width:1024px) 220px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    </div>
                    <h3 className="mt-4 text-[1rem] font-bold text-ink">{c.title}</h3>
                    <p className="mt-1 text-[0.84375rem] text-muted">{c.desc}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Block>

        <Block no="04" id="all-programs" title="연계 프로그램">
          <ul className="grid border-t border-ink sm:grid-cols-2 sm:gap-x-10">
            {programs.map((p) => (
              <li key={p.slug} className="border-b border-line">
                <Link href={`/${p.category}/${p.slug}`} className="group flex items-center justify-between py-4">
                  <span className="font-semibold text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">{p.title}</span>
                  <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </Block>

        <div className="flex flex-col items-start gap-5 rounded-md border border-line bg-cream p-8 md:flex-row md:items-center md:justify-between">
          <p className="t-h3">학교·기관 맞춤 진로체험 상담</p>
          <a href={`tel:${site.contact.phone}`} className="btn btn-primary">{site.contact.phone}</a>
        </div>
      </div>
    </SubPage>
  );
}

function Block({ no, id, title, desc, children }: { no: string; id: string; title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <p className="num">{no}</p>
      <h2 id={id} className="type-subsection-title mt-2 text-ink">{title}</h2>
      {desc && <p className="mt-2 text-muted">{desc}</p>}
      <div className="mt-8">{children}</div>
    </section>
  );
}
