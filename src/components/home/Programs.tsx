import localFont from "next/font/local";
import { DroneBall } from "@/components/ui/DroneBall";
import "./Programs.css";
import { photos } from "@/content/photos.generated";
import { categoryLabel, programs } from "@/content/programs";
import { ProgramSlider, type ProgramCard } from "./ProgramSlider";

const programFont = localFont({
  variable: "--font-program-display",
  src: [
    { path: "../../../public/fonts/paperlogy/Paperlogy-4Regular.woff2", weight: "400", style: "normal" },
    { path: "../../../public/fonts/paperlogy/Paperlogy-5Medium.woff2", weight: "500", style: "normal" },
    { path: "../../../public/fonts/paperlogy/Paperlogy-8ExtraBold.woff2", weight: "800", style: "normal" },
  ],
  display: "swap",
  preload: false,
});

export function Programs() {
  const cards: ProgramCard[] = programs.map((program) => ({
    href: `/${program.category}/${program.slug}`,
    title: program.title,
    category: categoryLabel[program.category],
    badge: program.badge,
    image: photos[program.image].src,
    target: program.card.target,
    period: program.card.period,
    tags: program.keywords.slice(0, 2),
  }));
  return (
    <section aria-labelledby="programs-title" className="programs-field turf relative isolate overflow-hidden py-12 md:py-16">
      <FieldIllustration />
      <div className={`site-content-frame relative z-10 ${programFont.className} ${programFont.variable}`}><ProgramSlider cards={cards} /></div>
    </section>
  );
}

const svgUrl = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
/** 풀잎 — 듬성듬성 흩어진 작은 풀 */
const TUFTS = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="150"><g fill="none" stroke="white" stroke-opacity=".1" stroke-width="1.6" stroke-linecap="round">` +
    `<path d="M20 30l-3-7M24 30v-9M28 30l3-7"/><path d="M118 22l-2-6M121 22v-8M124 22l2-6"/><path d="M70 92l-3-7M74 92v-9M78 92l3-7"/>` +
    `<path d="M152 118l-2-6M155 118v-8M158 118l2-6"/><path d="M36 132l-2-5M39 132v-7M42 132l2-5"/></g></svg>`,
);
/** 그물 — 경기장 펜스 그물망 */
const MESH = svgUrl(
  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><g stroke="white" stroke-opacity=".22" stroke-width="1"><path d="M0 0l14 14M14 0L0 14"/></g></svg>`,
);

/**
 * 일러스트 드론축구장 (장식, 스크린리더 제외)
 * 체크무늬 잔디(turf) + 풀잎 / 그물 펜스 띠 / 둥근 경기장 선·가운데 원·골 구역 반원·코너 호 /
 * 기둥 달린 링 골대(좌우 여백, xl 이상) / 점선 궤적을 그리며 나는 드론축구공(위·아래 빈 곳)
 * 모바일(md 미만)은 잔디·풀잎만.
 */
function FieldIllustration() {
  const line = "rgb(255 255 255 / 0.32)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {/* 풀잎 */}
      <div className="absolute inset-0" style={{ backgroundImage: TUFTS }} />

      <div className="absolute inset-0 hidden md:block">
        {/* 그물 펜스: 가장자리 띠(가운데를 mask 로 비움) + 안쪽 테두리 */}
        <div
          className="absolute inset-3 rounded-[1.75rem] p-4"
          style={{
            backgroundImage: MESH,
            mask: "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)",
            WebkitMask: "linear-gradient(#000 0 0) content-box xor, linear-gradient(#000 0 0)",
          }}
        />
        <div className="absolute inset-3 rounded-[1.75rem] border-2 border-white/20" />
        <div className="absolute inset-7 rounded-[1.25rem] border-[3px] border-white/35" />

        {/* 경기장 선 (펜스 안쪽) */}
        <div className="absolute inset-y-7 left-1/2 w-[3px] -translate-x-1/2 bg-white/30" />
        <svg viewBox="0 0 200 200" className="absolute left-1/2 top-1/2 h-[clamp(13.75rem,24vw,21.25rem)] w-[clamp(13.75rem,24vw,21.25rem)] -translate-x-1/2 -translate-y-1/2" fill="none">
          <circle cx="100" cy="100" r="97" stroke={line} strokeWidth="3" vectorEffect="non-scaling-stroke" />
          <circle cx="100" cy="100" r="6" fill="rgb(255 255 255 / 0.4)" />
        </svg>
        {(["left", "right"] as const).map((side) => {
          const L = side === "left";
          return (
            <div key={side}>
              {/* 골 구역 반원 */}
              <svg
                viewBox="0 0 100 200"
                className={`absolute top-1/2 h-[36%] -translate-y-1/2 ${L ? "left-7" : "right-7 -scale-x-100"}`}
                style={{ aspectRatio: "1 / 2" }}
                fill="none"
              >
                <path d="M0 6 A94 94 0 0 1 0 194" stroke={line} strokeWidth="3" vectorEffect="non-scaling-stroke" />
              </svg>
              {/* 코너 호 */}
              {(["top", "bottom"] as const).map((v) => (
                <svg
                  key={v}
                  viewBox="0 0 40 40"
                  className={`absolute h-10 w-10 ${v === "top" ? "top-7" : "bottom-7"} ${L ? "left-7" : "right-7"} ${L ? "" : "-scale-x-100"} ${v === "bottom" ? "-scale-y-100" : ""}`}
                  fill="none"
                >
                  <path d="M0 22 A22 22 0 0 0 22 0" stroke={line} strokeWidth="3" vectorEffect="non-scaling-stroke" />
                </svg>
              ))}
              {/* 링 골대: 링(측면에서 본 타원) + 기둥 + 받침 그림자 */}
              <svg
                viewBox="0 0 44 110"
                className={`absolute top-1/2 hidden h-[6.875rem] w-11 -translate-y-[62%] xl:block ${L ? "left-7 -translate-x-1/2" : "right-7 translate-x-1/2"}`}
                fill="none"
              >
                <ellipse cx="22" cy="100" rx="13" ry="4" fill="rgb(0 0 0 / 0.18)" />
                <path d="M22 62v38" stroke="rgb(255 255 255 / 0.75)" strokeWidth="4" strokeLinecap="round" />
                <ellipse cx="22" cy="34" rx="15" ry="27" stroke="white" strokeWidth="6" />
                <ellipse cx="22" cy="34" rx="15" ry="27" stroke="rgb(0 0 0 / 0.15)" strokeWidth="1.5" transform="translate(1.5 1.5)" />
                <ellipse cx="22" cy="34" rx="8" ry="18" stroke="rgb(255 255 255 / 0.35)" strokeWidth="1.5" strokeDasharray="2 3" />
              </svg>
            </div>
          );
        })}

        {/* 날아다니는 드론축구공 + 점선 비행 궤적 (카드가 없는 위·아래 빈 곳) */}
        <svg viewBox="0 0 400 80" className="absolute right-[18%] top-[5.625rem] h-[4.5rem] w-[22.5rem]" fill="none">
          <path d="M8 70 C 120 72, 200 10, 330 30" stroke="rgb(255 255 255 / 0.45)" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
        </svg>
        <span className="absolute right-[calc(18%-0.75rem)] top-[6.25rem] h-9 w-9 rotate-12">
          <DroneBall />
        </span>
        <svg viewBox="0 0 400 80" className="absolute bottom-6 left-[20%] h-[4.5rem] w-[22.5rem]" fill="none">
          <path d="M392 12 C 280 8, 200 70, 70 52" stroke="rgb(255 255 255 / 0.45)" strokeWidth="2" strokeDasharray="1 7" strokeLinecap="round" />
        </svg>
        <span className="absolute bottom-[2.625rem] left-[calc(20%+2.25rem)] h-8 w-8 -rotate-12">
          <DroneBall />
        </span>
      </div>
    </div>
  );
}
