import Image from "next/image";
import Link from "next/link";
import { careerCards, careerSchools } from "@/content/career";
import { photos } from "@/content/photos.generated";
import { site } from "@/config/site";

export function CareerSection() {
  return (
    <section aria-labelledby="career-title" className="py-20 md:py-28">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.18em] text-primary">Career</p>
            <h2 id="career-title" className="text-[26px] font-bold leading-[1.4] text-ink md:text-[34px]">
              진로가 미래다!
              <br />
              <span className="text-primary">미래기술</span>로 만나는 <span className="text-brand-green-ink">직업 세계</span>
            </h2>
            <p className="mt-5 text-[16px] leading-[1.85] text-body">
              교육부 인증 교육기부 진로체험기관 상상마루는 드론·3D프린터·코딩·VR/AR·로봇·IoT 여섯 가지 미래기술을 직접 만들고 조종하는
              진로체험 스쿨을 운영합니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/career" className="inline-flex h-12 items-center rounded-full bg-ink px-6 text-[15px] font-bold text-white hover:bg-primary">
                진로·직업체험 자세히
              </Link>
              <a href={`tel:${site.contact.phone}`} className="inline-flex h-12 items-center rounded-full border border-line px-6 text-[15px] font-bold text-ink hover:border-primary hover:text-primary">
                전화 상담 {site.contact.phone}
              </a>
            </div>
          </div>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {careerSchools.map((s) => (
              <li key={s.no}>
                <Link href="/experience/school" className="block h-full rounded-2xl border border-line bg-white p-5 transition hover:border-primary/40 hover:shadow-card">
                  <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-muted">
                    <span aria-hidden className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    미래기술 {s.no}
                  </span>
                  <p className="mt-1 text-[18px] font-bold text-ink">{s.name}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.tagline}</p>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {careerCards.map((c) => {
            const img = photos[c.photo];
            return (
              <li key={c.title}>
                <Link href={c.href} className="group relative block aspect-[4/5] overflow-hidden rounded-card">
                  <Image src={img.src} alt={c.title} fill sizes="(min-width:1024px) 280px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="text-[18px] font-bold">{c.title}</p>
                    <p className="mt-1 text-[13px] leading-snug text-white/85">{c.desc}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
