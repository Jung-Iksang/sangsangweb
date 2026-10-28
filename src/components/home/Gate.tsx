import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { site } from "@/config/site";

const gates = [
  {
    key: "education",
    eyebrow: `SINCE ${site.foundingYear}`,
    name: "교육활동",
    tagline: "학교 안팎에서 만나는\n방과후·늘봄·자유학년제 교육",
    href: "/education/afterschool",
    image: "/mock/hero-education.svg",
    accent: "bg-primary",
    links: [
      { label: "방과후/늘봄", href: "/education/afterschool" },
      { label: "자유학년(기)제", href: "/education/freeyear" },
      { label: "드론축구단", href: "/education/drone" },
      { label: "강사양성과정", href: "/education/hrd" },
    ],
  },
  {
    key: "experience",
    eyebrow: "CAREER EXPERIENCE",
    name: "체험활동",
    tagline: "직접 만들고 탐구하는\n창의·SW·AI·문화예술 체험",
    href: "/experience/creative",
    image: "/mock/hero-experience.svg",
    accent: "bg-brand-green",
    links: [
      { label: "창의적체험활동", href: "/experience/creative" },
      { label: "SW.AI교육주간", href: "/experience/swai" },
      { label: "과학의날 지원", href: "/experience/science" },
      { label: "문화예술체험", href: "/experience/culture" },
    ],
  },
];

/** 메인 비주얼: 두 개의 분할 패널 (마우스를 올린 패널이 넓어짐) */
export function Gate() {
  return (
    <section aria-label="주요 분야" className="flex flex-col bg-[#0f172a] md:h-[min(78vh,680px)] md:min-h-[540px] md:flex-row">
      {gates.map((g) => (
        <article
          key={g.key}
          className="group relative flex min-h-[420px] flex-1 items-end overflow-hidden text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] md:min-h-0 md:hover:flex-grow-[1.35]"
        >
          <SmartImage
            src={g.image}
            alt={`${g.name} 대표 이미지`}
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/5" aria-hidden />
          <div className="relative w-full p-7 md:p-12">
            <p className="mb-3 text-[12px] font-bold tracking-[0.25em] text-white/80">{g.eyebrow}</p>
            <p className="flex items-center gap-3 text-[34px] font-bold leading-none md:text-[48px]">
              <span className={`inline-block h-3 w-3 rounded-sm ${g.accent}`} aria-hidden />
              {g.name}
            </p>
            <p className="mt-4 whitespace-pre-line text-[16px] leading-relaxed text-white/85 md:text-[18px]">{g.tagline}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {g.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex rounded-full border border-white/40 bg-white/10 px-4 py-2 text-[14px] font-medium backdrop-blur-sm transition hover:bg-white hover:text-ink"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={g.href} className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-white/90 hover:text-white">
              {g.name} 자세히 보기 <span aria-hidden>→</span>
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
