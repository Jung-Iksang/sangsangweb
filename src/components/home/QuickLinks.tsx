import Link from "next/link";

const links = [
  { no: "01", name: "교육활동", desc: "방과후마을학교 · 늘봄 · 강사양성", href: "/education/afterschool" },
  { no: "02", name: "체험활동", desc: "진로체험 스쿨 · 문화예술 · 드론축구", href: "/experience/school" },
  { no: "03", name: "진로·직업체험", desc: "교육부 인증 교육기부 진로체험기관", href: "/career" },
  { no: "04", name: "상상마루샵", desc: "백제문양 체험 키트 · 교구", href: "/store" },
];

/** 히어로 바로 아래 바로가기 줄 — 네 갈래 입구 (가는 선으로 나눈 4칸) */
export function QuickLinks() {
  return (
    <nav aria-label="바로가기" className="border-b border-line">
      <ul className="container-site grid grid-cols-2 lg:grid-cols-4">
        {links.map((l, n) => (
          <li
            key={l.href}
            className={`border-line ${n % 2 === 1 ? "border-l" : ""} ${n >= 2 ? "border-t lg:border-t-0" : ""} ${n === 2 ? "lg:border-l" : ""}`}
          >
            <Link href={l.href} className="group flex h-full items-center gap-4 px-4 py-6 transition-colors hover:bg-cream lg:px-7 lg:py-7">
              <span className="min-w-0 flex-1">
                <span className="num block">{l.no}</span>
                <span className="mt-1.5 block text-[1rem] font-bold text-ink">{l.name}</span>
                <span className="mt-1 block truncate text-[0.8125rem] text-muted">{l.desc}</span>
              </span>
              <span aria-hidden className="text-[1.125rem] text-muted transition-transform group-hover:translate-x-1 group-hover:text-green">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
