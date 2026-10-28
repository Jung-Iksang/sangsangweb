// 기업소개 PPT 원본 이미지 → public/photos/*.webp 변환 + src/content/photos.generated.ts 생성
//
// 사용:
//   unzip -o -q "[유한회사 상상마루] 2024_기업소개_PPT_New.pptx" "ppt/media/*" -d /tmp/smaru-ppt
//   node scripts/import-photos.mjs /tmp/smaru-ppt/ppt/media
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = process.argv[2];
if (!src) {
  console.error("원본 이미지 폴더 경로를 지정하세요.");
  process.exit(1);
}
const out = path.join(process.cwd(), "public", "photos");
mkdirSync(out, { recursive: true });

/** 출력 이름 → [원본 파일, 최대 변 길이, 옵션?] — 옵션: extract(잘라낼 영역), png(투명 배경 유지) */
const map = {
  "hero-education": ["image90.jpg", 1600],
  "hero-experience": ["image68.jpeg", 1600],
  about: ["image108.jpeg", 1400],
  "camp-group": ["image106.jpg", 1400],
  afterschool: ["image91.jpg", 1600],
  neulbom: ["image92.jpg", 1600],
  freeyear: ["image90.jpg", 1600],
  instructor: ["image108.jpeg", 1400],
  "instructor-lecture": ["image123.jpg", 1400],
  certificate: ["image123.jpg", 1400],
  school: ["image121.jpg", 1400],
  culture: ["image59.jpeg", 1600],
  "culture-stringart": ["image57.jpeg", 1400],
  "culture-hologram": ["image52.png", 1200],
  store: ["image44.png", 1400],
  "drone-festival": ["image61.jpeg", 1400],
  "drone-festival-2": ["image62.jpeg", 1200],
  "drone-seonhwa": ["image63.jpg", 1200],
  "drone-class": ["image66.jpg", 1400],
  "drone-iksan": ["image67.jpeg", 1400],
  "drone-iksan-2": ["image68.jpeg", 1400],
  "drone-jeonju": ["image128.jpeg", 1200],
  "drone-team": ["image127.jpg", 1200],
  "events-festival": ["image71.jpeg", 1200],
  "events-festival-2": ["image72.jpeg", 1200],
  "events-festival-3": ["image73.jpeg", 1200],
  "events-festival-poster": ["image79.jpeg", 1200],
  "events-hanoi": ["image83.jpeg", 1600],
  "events-swfestival-poster": ["image88.png", 1200],
  "events-swfestival-poster-2": ["image89.jpg", 1200],
  "events-kids-1": ["image95.png", 1200],
  "events-kids-2": ["image96.jpeg", 1200],
  "events-kids-3": ["image97.jpeg", 1200],
  "career-startup": ["image7.jpeg", 1200],
  "career-robot": ["image121.jpg", 1400],
  "career-mentoring": ["image123.jpg", 1400],
  "career-maker": ["image92.jpg", 1400],
  "cert-iksan": ["image23.png", 1000],
  "cert-moe": ["image26.png", 1000],
  "cert-award": ["image27.jpeg", 1000],
  "cert-social": ["image33.jpeg", 1000],
  "cert-lab": ["image35.png", 1200],
  "cert-venture": ["image34.png", 1000],
  "cert-plaque": ["image22.jpeg", 1000],
  // 브랜드: '호기심 충전소' 캘리그라피 (image6.png 왼쪽 0~737px, 투명 배경)
  "brand-calligraphy": ["image6.png", 1000, { extract: { left: 0, top: 0, width: 737, height: 289 }, png: true }],
};

const entries = [];
const dims = {};
let total = 0;
for (const [name, [file, max, opts = {}]] of Object.entries(map)) {
  let img = sharp(path.join(src, file)).rotate();
  if (opts.extract) img = sharp(await img.extract(opts.extract).trim().toBuffer());
  img = img.resize(max, max, { fit: "inside", withoutEnlargement: true });
  const ext = opts.png ? "png" : "webp";
  const target = path.join(out, `${name}.${ext}`);
  const info = await (opts.png ? img.png({ compressionLevel: 9, palette: true }) : img.webp({ quality: 82 })).toFile(target);
  total += info.size;
  dims[name] = { width: info.width, height: info.height };
  entries.push(`  "${name}": { src: "/photos/${name}.${ext}", width: ${info.width}, height: ${info.height} },`);
  console.log(`${name}.${ext} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB  ← ${file}`);
}
writeFileSync(
  path.join(process.cwd(), "src", "content", "photos.generated.ts"),
  `/** scripts/import-photos.mjs 가 생성한 파일 — 직접 수정하지 말 것 */\nexport const photos = {\n${entries.join("\n")}\n} as const;\n\nexport type PhotoName = keyof typeof photos;\n`,
);
writeFileSync(path.join(process.cwd(), "src", "content", "photos.dims.json"), JSON.stringify(dims, null, 2) + "\n");
console.log(`\n${entries.length}장, 총 ${(total / 1024 / 1024).toFixed(2)}MB → public/photos/`);
