import Image from "next/image";
import { greeting, historyHighlights } from "@/content/about";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";
import { CountUp } from "@/components/ui/CountUp";
import { YearTicker } from "@/components/ui/YearTicker";
import { SectionHead } from "./SectionHead";

export function AboutIntro() {
  const facts = [
    { n: 23, suffix: "종", v: "주무부처 등록 민간자격" },
    { n: site.certifications.length, suffix: "개", v: "인증·지정 (교육부·전북·벤처 등)" },
  ];
  const img = photos.about;
  return (
    <section aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="container-site">
        <SectionHead
          no="01"
          id="about-title"
          title={
            <>
              <span className="hl">2012년</span>부터, 익산의 학교와 함께
            </>
          }
          moreHref="/about/greeting"
          moreLabel="인사말 보기"
        />
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div>
            <p className="text-[17px] leading-[1.9] text-body">
              {site.tagline}. 2012년 창의융합교육연구회로 시작해 로봇·드론·코딩·3D프린팅 교육과 진로·직업체험, 문화예술 체험을 익산의 학교와
              지역사회에 전해 왔습니다. 전북 예비사회적기업으로서 지역의 일자리와 교육 기회를 함께 만듭니다.
            </p>
            <figure className="mt-10 border-l border-line-strong pl-6">
              <blockquote className="text-[19px] font-semibold leading-relaxed text-ink">“{greeting.quote.text}”</blockquote>
              <figcaption className="mt-3 text-[13px] text-muted">
                {greeting.quote.by} · <span lang="en">{greeting.quote.en}</span>
              </figcaption>
            </figure>
            <dl className="mt-12 grid grid-cols-3 divide-x divide-line border-y border-line">
              <div className="px-4 py-6 first:pl-0">
                <dt className="sr-only">연혁</dt>
                <dd className="text-[28px] font-extrabold tracking-tight text-ink md:text-[34px]">
                  <YearTicker items={historyHighlights} />
                </dd>
              </div>
              {facts.map((f) => (
                <div key={f.v} className="px-4 py-6 first:pl-0">
                  <dt className="sr-only">{f.v}</dt>
                  <dd className="text-[28px] font-extrabold tracking-tight text-ink md:text-[34px]">
                    <CountUp to={f.n} suffix={f.suffix} />
                  </dd>
                  <dd className="mt-1.5 text-[12.5px] leading-snug text-muted md:text-[13px]">{f.v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-line lg:order-first lg:aspect-auto">
            <Image src={img.src} alt="상상마루 교육과정을 수료한 학생들" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
