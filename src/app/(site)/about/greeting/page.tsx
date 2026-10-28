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
      <div className="grid gap-10 md:grid-cols-[1fr_300px]">
        <div className="space-y-6 text-[17px] leading-[1.9] text-body">
          <p className="text-[24px] font-bold leading-snug text-ink md:text-[28px]">{greeting.lead}</p>
          {greeting.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
          <blockquote className="rounded-2xl border-l-4 border-primary bg-primary-50 px-6 py-5">
            <p className="text-[18px] font-bold leading-relaxed text-ink">“{greeting.quote.text}”</p>
            <p className="mt-1 text-[14px] italic text-muted">{greeting.quote.en}</p>
            <footer className="mt-2 text-[14px] text-muted">— {greeting.quote.by}</footer>
          </blockquote>
          {greeting.sections.map((s) => (
            <section key={s.title} className="rounded-2xl bg-surface p-6">
              <h2 className="mb-2 text-[19px] font-bold text-primary">{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
          <p>{greeting.closing}</p>
          <p className="text-right text-[18px] font-bold text-ink">{greeting.signature}</p>
        </div>
        <div className="relative hidden aspect-[3/4] overflow-hidden rounded-card md:block">
          <Image src={img.src} alt="상상마루 캠프에 참가한 학생들" fill sizes="300px" className="object-cover" />
        </div>
      </div>
    </SubPage>
  );
}
