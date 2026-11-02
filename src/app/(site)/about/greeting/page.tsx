import Image from "next/image";
import { SubPage } from "@/components/layout/SubPage";
import { greeting } from "@/content/about";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "인사말",
  description: `${site.slogan} 상상마루 대표 인사말. 2012년 창의융합교육연구회로 출발한 익산의 4차 산업혁명 교육·진로체험 전문기관, ${site.legalName}를 소개합니다.`,
  path: "/about/greeting",
  keywords: ["상상마루 소개", "창의융합교육연구회", "익산 교육기관", "사회적기업"],
});

export default function Page() {
  const img = photos["camp-group"];
  return (
    <SubPage path="/about/greeting" title="인사말" description={`${site.slogan}, ${site.tagline} ${site.name}입니다.`}>
      <div className="grid gap-14 lg:grid-cols-[1fr_280px]">
        <div className="type-reading text-body">
          <p className="t-h2 !leading-snug">{greeting.lead}</p>
          <div className="mt-8 space-y-5">
            {greeting.body.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>

          <figure className="my-14 border-y border-line py-10">
            <blockquote className="text-[1.375rem] font-bold leading-relaxed tracking-tight text-ink">
              “<span className="hl">{greeting.quote.text}</span>”
            </blockquote>
            <figcaption className="mt-4 text-[0.84375rem] text-muted">
              {greeting.quote.by} · <span lang="en">{greeting.quote.en}</span>
            </figcaption>
          </figure>

          <div className="space-y-10">
            {greeting.sections.map((s, i) => (
              <section key={s.title}>
                <p className="num">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="type-subsection-title mt-2 text-ink">{s.title}</h2>
                <p className="mt-3">{s.text}</p>
              </section>
            ))}
          </div>

          <p className="mt-14">{greeting.closing}</p>
          <p className="mt-6 border-t border-line pt-6 text-right text-[1.125rem] font-bold text-ink">{greeting.signature}</p>
        </div>
        <div className="relative hidden aspect-[3/4] self-start overflow-hidden rounded-md bg-line lg:block">
          <Image src={img.src} alt="상상마루 캠프에 참가한 학생들" fill sizes="280px" className="object-cover" />
        </div>
      </div>
    </SubPage>
  );
}
