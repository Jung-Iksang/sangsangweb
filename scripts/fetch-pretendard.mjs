// Pretendard Variable (동적 서브셋) 자체 호스팅용 다운로드 — 1회 실행
// 사용: node scripts/fetch-pretendard.mjs
// 결과: public/fonts/pretendard/{pretendard.css, PretendardVariable.subset.N.woff2, LICENSE.txt}
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const VERSION = "1.3.9";
const BASE = `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v${VERSION}`;
const CSS_URL = `${BASE}/dist/web/variable/pretendardvariable-dynamic-subset.min.css`;
const out = path.join(process.cwd(), "public", "fonts", "pretendard");
mkdirSync(out, { recursive: true });

const get = async (url, as = "text") => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return as === "text" ? res.text() : Buffer.from(await res.arrayBuffer());
};

let css = await get(CSS_URL);
const files = [...new Set([...css.matchAll(/url\(([^)]+\.woff2)\)/g)].map((m) => m[1].replace(/['"]/g, "")))];
let total = 0;
for (const rel of files) {
  const name = path.basename(rel);
  const buf = await get(new URL(rel, CSS_URL).href, "buffer");
  writeFileSync(path.join(out, name), buf);
  total += buf.length;
  css = css.split(rel).join(`./${name}`);
}
writeFileSync(path.join(out, "pretendard.css"), css);
writeFileSync(path.join(out, "LICENSE.txt"), await get(`${BASE}/LICENSE`));
console.log(`${files.length} woff2, ${(total / 1024 / 1024).toFixed(2)}MB → public/fonts/pretendard/`);
