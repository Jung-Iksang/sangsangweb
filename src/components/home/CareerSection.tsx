import Image from "next/image";
import Link from "next/link";
import { careerCards, careerSchools } from "@/content/career";
import { photos } from "@/content/photos.generated";
import { SectionHead } from "./SectionHead";

export function CareerSection() {
  return (
    <section aria-labelledby="career-title" className="py-20 md:py-28">
      <div className="container-site">
        <SectionHead
          no="03"
          id="career-title"
          title={
            <>
              진로가 미래다! <span className="hl">미래기술</span>로 만나는 직업 세계
            </>
          }
          desc="교육부 인증 교육기부 진로체험기관 상상마루는 여섯 가지 미래기술을 직접 만들고 조종하는 진로체험 스쿨을 운영합니다."
          moreHref="/career"
          moreLabel="진로·직업체험"
        />

        <ol className="grid border-t border-ink md:grid-cols-2 md:gap-x-12">
          {careerSchools.map((s) => (
            <li key={s.no} className="border-b border-line">
              <Link href="/experience/school" className="group flex items-center gap-5 py-5 transition-colors hover:bg-cream md:px-3">
                <span className="num w-6 shrink-0">{s.no}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[19px] font-bold text-ink">{s.name}</span>
                  <span className="mt-0.5 block text-[14px] text-muted">{s.tagline}</span>
                </span>
                <span aria-hidden className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
                <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </li>
          ))}
        </ol>

        <ul className="mt-16 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {careerCards.map((c) => {
            const img = photos[c.photo];
            return (
              <li key={c.title}>
                <Link href={c.href} className="group block">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-line transition-[translate,box-shadow] duration-300 ease-out group-hover:shadow-lift group-focus-visible:shadow-lift motion-safe:group-hover:-translate-y-1.5 motion-safe:group-focus-visible:-translate-y-1.5">
                    <Image src={img.src} alt={c.title} fill sizes="(min-width:1024px) 270px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                  </div>
                  <p className="mt-4 text-[16px] font-bold text-ink">{c.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-muted">{c.desc}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
