import Image from "next/image";
import Link from "next/link";
import { photos } from "@/content/photos.generated";

const gates = [
  {
    no: "01",
    name: "교육활동",
    tagline: "학교 밖에서도 이어지는 배움",
    href: "/education/afterschool",
    photo: photos["hero-education"],
    alt: "창의공학실에서 코딩 수업을 듣는 학생들",
    links: [
      { label: "방과후마을학교", href: "/education/afterschool" },
      { label: "늘봄학교", href: "/education/neulbom" },
      { label: "강사양성과정", href: "/education/instructor" },
      { label: "민간자격증", href: "/education/certificate" },
    ],
  },
  {
    no: "02",
    name: "체험활동",
    tagline: "세상을 바꾸는 미래기술을 직접",
    href: "/experience/school",
    photo: photos["hero-experience"],
    alt: "익산드론축구단 단원들의 단체 사진",
    links: [
      { label: "진로체험 스쿨", href: "/experience/school" },
      { label: "드론축구단", href: "/experience/drone-soccer" },
      { label: "문화예술체험", href: "/experience/culture" },
      { label: "대회·행사", href: "/experience/events" },
    ],
  },
];

/** 메인 비주얼: 화면을 채우는 분할 사진 패널 (마우스를 올린 패널이 넓어짐) */
export function Gate() {
  return (
    <section aria-label="주요 분야" className="flex flex-col bg-ink md:h-[min(76vh,660px)] md:min-h-[520px] md:flex-row">
      {gates.map((g) => (
        <article
          key={g.no}
          className="group relative flex min-h-[440px] flex-1 items-end overflow-hidden text-white transition-[flex-grow] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] md:min-h-0 md:hover:grow-[1.35]"
        >
          <Image
            src={g.photo.src}
            alt={g.alt}
            fill
            priority
            sizes="(min-width: 768px) 60vw, 100vw"
            className="object-cover transition-transform duration-[1200ms] group-hover:scale-[1.03]"
          />
          {/* 글자 가독성용 하단 스크림 (사진 아래쪽만 옅게) */}
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-t from-black/85 via-black/50 to-transparent" />

          <div className="relative w-full p-7 md:p-12">
            <p className="text-[13px] font-semibold tabular-nums tracking-[0.04em] text-on-ink-green">{g.no}</p>
            <p className="mt-2 text-[36px] font-extrabold leading-none tracking-tight md:text-[48px]">{g.name}</p>
            <p className="mt-4 text-[16px] font-medium text-white/85 md:text-[18px]">{g.tagline}</p>

            <ul className="mt-6 flex flex-wrap items-center border-t border-white/25 pt-3 text-[14.5px] text-white/85">
              {g.links.map((l, i) => (
                <li key={l.href} className="flex items-center">
                  {i > 0 && <span aria-hidden className="mx-1 text-white/35">/</span>}
                  <Link href={l.href} className="inline-flex min-h-11 items-center px-1.5 hover:text-white hover:underline hover:underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link href={g.href} className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-white underline decoration-white/40 underline-offset-[6px] hover:decoration-white">
              {g.name} 자세히 보기 <span aria-hidden>→</span>
            </Link>
          </div>
        </article>
      ))}
    </section>
  );
}
