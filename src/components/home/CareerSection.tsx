import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { careerCards, careerSteps } from "@/content/career";
import { site } from "@/config/site";

export function CareerSection() {
  return (
    <section aria-labelledby="career-title" className="py-20 md:py-28">
      <div className="container-site">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.18em] text-primary">Career</p>
            <h2 id="career-title" className="text-[26px] font-bold leading-[1.4] text-ink md:text-[34px]">
              진로·직업체험,
              <br />
              <span className="text-primary">발견</span>에서 <span className="text-brand-green-ink">성장</span>까지 함께합니다
            </h2>
            <p className="mt-5 text-[16px] leading-[1.85] text-body">
              한 번의 체험으로 끝나지 않도록, 상상마루는 학생 한 명 한 명의 진로 여정을 여섯 단계로 설계해 동행합니다.
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
            {careerSteps.map((s) => (
              <li key={s.no} className="rounded-2xl border border-line bg-white p-5 transition hover:border-primary/40 hover:shadow-card">
                <span className="text-[13px] font-bold text-primary">{s.no}</span>
                <p className="mt-1 text-[19px] font-bold text-ink">{s.title}</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {careerCards.map((c) => (
            <li key={c.title}>
              <Link href={c.href} className="group relative block aspect-[4/5] overflow-hidden rounded-card">
                <SmartImage src={c.image} alt={c.title} fill sizes="(min-width:1024px) 280px, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-[18px] font-bold">{c.title}</p>
                  <p className="mt-1 text-[13px] leading-snug text-white/80">{c.desc}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
