// 목업 이미지(SVG) 생성기 — 실제 사진이 준비되면 관리자 업로드 또는 public/ 교체로 대체합니다.
// 사용: node scripts/gen-mock.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const out = join(process.cwd(), "public", "mock");
mkdirSync(out, { recursive: true });

const palettes = [
  ["#1f63c9", "#5b9bf0"], // blue
  ["#5d9d2f", "#a6d46e"], // green
  ["#e0a100", "#ffd257"], // yellow
  ["#c23a46", "#f07a83"], // red
  ["#3b4fb8", "#8a7cf0"], // indigo
  ["#11869a", "#5cc8d6"], // teal
];

function svg({ w, h, label, sub, p, seed, corner = false }) {
  const [a, b] = palettes[p % palettes.length];
  const r = (n) => ((Math.sin(seed * 999 + n * 77) + 1) / 2);
  const circles = Array.from({ length: 5 }, (_, i) => {
    const cx = Math.round(r(i) * w), cy = Math.round(r(i + 10) * h);
    const rad = Math.round((0.08 + r(i + 20) * 0.22) * Math.min(w, h));
    return `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="#fff" fill-opacity="${(0.06 + r(i + 30) * 0.1).toFixed(2)}"/>`;
  }).join("");
  const fs = Math.round(Math.min(w, h) * 0.085);
  if (corner) {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label} (목업 이미지)">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>${circles}
<text x="${w - 40}" y="60" text-anchor="end" font-family="sans-serif" font-size="22" letter-spacing="3" fill="#fff" fill-opacity=".6">${sub}</text>
</svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label} (목업 이미지)">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
<rect width="${w}" height="${h}" fill="url(#g)"/>${circles}
<g transform="translate(${w / 2} ${h / 2 - fs * 0.6})" fill="none" stroke="#fff" stroke-opacity=".85" stroke-width="${Math.max(2, fs / 12)}" stroke-linejoin="round">
<rect x="${-fs * 0.9}" y="${-fs * 0.65}" width="${fs * 1.8}" height="${fs * 1.3}" rx="${fs * 0.18}"/>
<circle cx="${-fs * 0.35}" cy="${-fs * 0.2}" r="${fs * 0.16}"/>
<path d="M${-fs * 0.9} ${fs * 0.45} L${-fs * 0.25} ${-fs * 0.05} L${fs * 0.15} ${fs * 0.3} L${fs * 0.45} ${fs * 0.05} L${fs * 0.9} ${fs * 0.45}"/>
</g>
<text x="50%" y="${h / 2 + fs * 1.05}" text-anchor="middle" font-family="Spoqa Han Sans Neo, Apple SD Gothic Neo, Malgun Gothic, sans-serif" font-size="${fs * 0.62}" font-weight="700" fill="#fff">${label}</text>
<text x="50%" y="${h / 2 + fs * 1.75}" text-anchor="middle" font-family="sans-serif" font-size="${fs * 0.36}" letter-spacing="2" fill="#fff" fill-opacity=".75">${sub}</text>
</svg>`;
}

const items = [
  ["hero-education", 1600, 1000, "교육활동", 0],
  ["hero-experience", 1600, 1000, "체험활동", 1],
  ["program-afterschool", 1200, 800, "방과후/늘봄 교육", 0],
  ["program-outside", 1200, 800, "학교밖 늘봄교육", 1],
  ["program-freeyear", 1200, 800, "자유학년(기)제", 2],
  ["program-drone", 1200, 800, "탑마루드론축구단", 5],
  ["program-hrd", 1200, 800, "HRD-Net 강사양성과정", 4],
  ["program-volunteer", 1200, 800, "교육기부 진로체험", 3],
  ["program-creative", 1200, 800, "창의적체험활동", 2],
  ["program-swai", 1200, 800, "SW.AI 교육주간", 4],
  ["program-science", 1200, 800, "과학의날 행사 지원", 5],
  ["program-culture", 1200, 800, "문화예술체험 교육", 3],
  ["career-1", 900, 1100, "직업 탐색", 0],
  ["career-2", 900, 1100, "현장 체험", 1],
  ["career-3", 900, 1100, "전문가 멘토링", 2],
  ["career-4", 900, 1100, "진로 설계", 3],
  ["about", 1200, 900, "상상마루", 0],
  ...Array.from({ length: 10 }, (_, i) => [`gallery-${i + 1}`, 1200, 900, `활동사진 ${i + 1}`, i]),
];

for (const [name, w, h, label, p] of items) {
  const corner = name.startsWith("hero-");
  writeFileSync(join(out, `${name}.svg`), svg({ w, h, label, sub: "MOCKUP IMAGE", p, seed: name.length + p + w, corner }));
}
console.log(`generated ${items.length} mock images → public/mock`);
