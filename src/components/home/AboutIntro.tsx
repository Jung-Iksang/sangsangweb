import Image from "next/image";
import Link from "next/link";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";

export function AboutIntro() {
  const facts = [
    { k: `${site.originYear}`, v: "창의융합교육연구회 창립 · 2013 법인 등록" },
    { k: "23종", v: "주무부처 등록 민간자격" },
    { k: "교육부 인증", v: "교육기부 진로체험기관" },
  ];
  const img = photos.about;
  return (
    <section aria-labelledby="about-title" className="py-20 md:py-28">
      <div className="container-site grid items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
        <div>
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.18em] text-primary">About us</p>
          <h2 id="about-title" className="text-[28px] font-bold leading-[1.35] text-ink md:text-[38px]">
            {site.slogan},
            <br />
            <span className="text-primary">상상마루</span>
          </h2>
          <p className="mt-6 text-[16px] leading-[1.85] text-body md:text-[17px]">
            {site.tagline}. 2012년 창의융합교육연구회로 시작해 로봇·드론·코딩·3D프린팅 교육과 진로·직업체험, 문화예술 체험을
            익산의 학교와 지역사회에 제공해 왔습니다. 전북 예비사회적기업으로서 지역의 일자리와 교육 기회를 함께 만듭니다.
          </p>
          <dl className="mt-8 grid grid-cols-3 gap-3">
            {facts.map((f) => (
              <div key={f.v} className="rounded-2xl border border-line bg-white p-4">
                <dt className="sr-only">{f.v}</dt>
                <dd className="text-[19px] font-bold text-ink md:text-[22px]">{f.k}</dd>
                <dd className="mt-1 text-[12.5px] leading-snug text-muted md:text-[13.5px]">{f.v}</dd>
              </div>
            ))}
          </dl>
          <Link href="/about/greeting" className="mt-8 inline-flex items-center gap-2 font-bold text-primary transition-all hover:gap-3">
            단체소개 자세히 보기 <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="relative">
          <div aria-hidden className="absolute -left-4 -top-4 h-24 w-24 rounded-[22px] bg-brand-yellow/30" />
          <div aria-hidden className="absolute -bottom-5 -right-3 h-28 w-28 rounded-[26px] bg-brand-green/25" />
          <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-card">
            <Image src={img.src} alt="상상마루 교육과정을 수료한 학생들" fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
