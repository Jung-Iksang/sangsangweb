// Paperlogy (페이퍼로지, OFL) 자체 호스팅용 다운로드 — 1회 실행
// 사용: npm run fetch-paperlogy
// 결과: public/fonts/paperlogy/{paperlogy.css, Paperlogy-N.subset.woff2, LICENSE.txt}
// KS X 1001 완성형 2,350자 서브셋(굵기당 ~150KB). 서브셋에 없는 글자는 Pretendard 로 폴백.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const VERSION = "1.001";
const BASE = `https://cdn.jsdelivr.net/gh/ayaan-fonts/Paperlogy@v${VERSION}/fonts/webfonts/woff2-subset`;
// 본문 500 · 강조 600 · 제목 700 (400·800 은 일부 요소)
const WEIGHTS = { 400: "4Regular", 500: "5Medium", 600: "6SemiBold", 700: "7Bold", 800: "8ExtraBold" };
const out = path.join(process.cwd(), "public", "fonts", "paperlogy");
mkdirSync(out, { recursive: true });

const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return Buffer.from(await res.arrayBuffer());
};

let css = "/* Paperlogy v" + VERSION + " (SIL OFL 1.1) — scripts/fetch-paperlogy.mjs 로 생성 */\n";
let total = 0;
for (const [weight, name] of Object.entries(WEIGHTS)) {
  const file = `Paperlogy-${weight}.subset.woff2`;
  const buf = await get(`${BASE}/Paperlogy-${name}.subset.woff2`);
  writeFileSync(path.join(out, file), buf);
  total += buf.length;
  // local() 은 쓰지 않음 — 설치된 다른 버전이 잡히면 화면마다 글자 모양이 달라짐
  css += `@font-face{font-family:"Paperlogy";font-weight:${weight};font-style:normal;font-display:swap;src:url(./${file}) format("woff2")}\n`;
}
writeFileSync(path.join(out, "paperlogy.css"), css);
writeFileSync(
  path.join(out, "LICENSE.txt"),
  `Paperlogy (페이퍼로지) — 이주임 · 김도균, based on Gmarket Sans
https://freesentation.blog/paperlogyfont

This Font Software is licensed under the SIL Open Font License, Version 1.1.
https://openfontlicense.org/open-font-license-official-text/
`,
);
console.log(`${Object.keys(WEIGHTS).length} woff2, ${(total / 1024).toFixed(0)}KB → public/fonts/paperlogy/`);
