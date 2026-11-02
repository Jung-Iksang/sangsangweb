// 원본 이미지 → public/photos/*.webp 변환 + src/content/photos.generated.ts 생성
//
// 원본 두 가지:
//  1) 2024 기업소개 PPT 미디어 — 회사·인증·행사·교육활동 사진
//       unzip -o -q "[유한회사 상상마루] 2024_기업소개_PPT_New.pptx" "ppt/media/*" -d /tmp/smaru-ppt
//  2) 2026 진로·직업체험 운영계획(안)·요약 PDF — 진로·직업체험 프로그램 사진 (cp-*)
//       swift scripts/extract-pdf-images.swift "<운영계획.pdf>" /tmp/smaru-pdf/plan
//       swift scripts/extract-pdf-images.swift "<요약.pdf>" /tmp/smaru-pdf/summary
//
// 사용:
//   node scripts/import-photos.mjs --ppt /tmp/smaru-ppt/ppt/media --pdf /tmp/smaru-pdf
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const arg = (name) => {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const pptDir = arg("--ppt");
const pdfDir = arg("--pdf");
if (!pptDir || !pdfDir) {
  console.error("사용: node scripts/import-photos.mjs --ppt <PPT media 폴더> --pdf <PDF 추출 폴더>");
  process.exit(1);
}
const out = path.join(process.cwd(), "public", "photos");
mkdirSync(out, { recursive: true });

/** 출력 이름 → [PPT 원본 파일, 최대 변 길이, 옵션?] — 옵션: extract(잘라낼 영역), png(투명 배경 유지) */
const pptMap = {
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

/**
 * 진로·직업체험 프로그램 사진 — 프로그램 slug(src/content/career-programs.ts) → PDF 추출 파일(확장자 제외)
 * 첫 장은 cp-<slug>(대표), 나머지는 cp-<slug>-2, -3 … 로 저장된다.
 * plan/ = 운영계획(안) PDF, summary/ = 요약 PDF. 파일 이름은 pNN(쪽)-iMM(위→아래 순서).
 */
const pdfMap = {
  "ai-car": ["plan/p02-i03", "plan/p02-i02"],
  chatgpt: ["plan/p02-i06", "plan/p02-i08"],
  "ai-coding-lab": ["plan/p03-i02", "plan/p03-i01"],
  hologram: ["plan/p03-i03", "plan/p03-i04", "plan/p03-i05"],
  "drone-dream": ["plan/p04-i01"],
  "heritage-drone": ["plan/p04-i04"],
  "drone-coding": ["plan/p05-i01", "plan/p05-i02"],
  "media-creator": ["plan/p05-i11", "plan/p05-i04"],
  "robot-coordinator": ["plan/p06-i03"],
  "smart-farm": ["plan/p06-i05", "plan/p06-i06"],
  "3d-modeling": ["plan/p07-i05", "plan/p07-i06", "plan/p07-i03"],
  "3d-pen": ["plan/p07-i10", "plan/p07-i09", "plan/p07-i11"],
  "vr-vive": ["plan/p08-i02", "plan/p08-i01"],
  "vr-cardboard": ["plan/p08-i03", "plan/p08-i04"],
  ar: ["plan/p09-i01", "plan/p09-i02"],
  "coding-club": ["plan/p09-i05", "plan/p09-i03"],
  "coding-story": ["plan/p10-i01", "plan/p10-i02", "plan/p10-i03"],
  "science-level-up": ["plan/p10-i06", "plan/p10-i07", "plan/p10-i08"],
  "led-acrylic": ["plan/p11-i03", "plan/p11-i02", "plan/p11-i04"],
  "drone-soccer-class": ["plan/p11-i06"],
  "baekje-hanji-lamp": ["plan/p12-i01", "plan/p12-i02"],
  "string-art": ["plan/p12-i06", "plan/p12-i04"],
  "baekje-led-dice": ["plan/p13-i02", "plan/p13-i01", "plan/p13-i03"],
  "wind-chime": ["plan/p13-i07", "plan/p13-i05", "plan/p13-i06"],
  "toktok-block": ["plan/p14-i03", "plan/p14-i02", "plan/p14-i01"],
  "history-cube": ["plan/p14-i06", "plan/p14-i05"],
  "k-heritage-led": ["plan/p15-i05", "plan/p15-i02", "plan/p15-i04"],
  "mini-folding-screen": ["plan/p15-i07", "plan/p15-i08"],
  "baekje-tangram": ["plan/p16-i04", "plan/p16-i03", "plan/p16-i01"],
  "muwang-automata": ["plan/p16-i06"],
  "mireuksa-puzzle": ["plan/p17-i01", "plan/p17-i02"],
  "ssangneung-puzzle": ["plan/p17-i03", "plan/p17-i04"],
  "vr-360": ["plan/p18-i01", "plan/p18-i02"],
  "sublimation-tile": ["plan/p18-i04", "plan/p18-i03"],
  "laser-engraving": ["plan/p19-i02", "plan/p19-i01"],
  "hanji-craft": ["plan/p19-i03"],
  "science-1": ["plan/p20-i02", "plan/p20-i01"],
  "science-2": ["plan/p20-i04", "plan/p20-i03"],
  "leather-craft": ["plan/p21-i01", "plan/p21-i02"],
  "napkin-art": ["plan/p21-i03", "plan/p21-i04"],
  "ribbon-craft": ["plan/p22-i01", "plan/p22-i02"],
  macrame: ["plan/p22-i04", "plan/p22-i03"],
  minhwa: ["plan/p23-i01", "plan/p23-i02"],
  "total-craft": ["plan/p23-i03", "plan/p23-i05"],
  "pop-art": ["plan/p24-i01", "plan/p24-i02"],
  "fancy-wood": ["plan/p24-i03", "plan/p24-i04", "plan/p24-i05"],
  metaverse: ["plan/p25-i02", "plan/p25-i01"],
  "vr-metaverse-coding": ["plan/p25-i03", "plan/p25-i04"],
  "custom-mug": ["plan/p26-i01", "plan/p26-i02", "plan/p26-i03"],
  "career-counseling": ["plan/p26-i04", "plan/p26-i05"],
  terrarium: ["plan/p27-i01", "plan/p27-i02"],
  "nail-art": ["plan/p27-i04", "plan/p27-i03"],
  "balloon-art": ["plan/p28-i02", "plan/p28-i01", "plan/p28-i03"],
  "altino-racing": ["plan/p28-i05", "plan/p28-i04"],
  "christmas-wreath": ["plan/p29-i01", "plan/p29-i02"],
  "najeon-keyring": ["plan/p29-i03", "plan/p29-i04"],
  perfumer: ["plan/p30-i02", "plan/p30-i03", "plan/p30-i01"],
  chocolatier: ["plan/p30-i04", "plan/p30-i05"],
  "ai-game-coding": ["plan/p31-i03", "plan/p31-i02"],
  "moru-tree-card": ["plan/p31-i05", "plan/p31-i04"],
  "paper-folding": ["plan/p32-i04", "plan/p32-i01", "plan/p32-i03"],
  "swarm-drone": ["plan/p32-i06", "plan/p32-i05"],
  kamibot: ["plan/p33-i02", "plan/p33-i01"],
  // 요약 PDF 에만 있는 프로그램 (4쪽 표 사진) — 아이콘뿐인 칸은 쓰지 않음
  "stained-glass": ["summary/p04-i02"],
  "animal-assisted": ["summary/p04-i05"],
  environment: ["summary/p04-i04"],
  "art-therapy": ["summary/p04-i07"],
  "music-therapy": ["summary/p04-i06"],
  "science-earth": ["summary/p04-i08"],
  "science-chemistry": ["summary/p04-i09"],
  "science-physics": ["summary/p04-i10"],
  "science-biology": ["summary/p04-i11"],
};

function pdfFile(rel) {
  for (const ext of [".jpg", ".png"]) {
    const f = path.join(pdfDir, rel + ext);
    if (existsSync(f)) return f;
  }
  throw new Error(`PDF 추출 파일 없음: ${rel} (extract-pdf-images.swift 를 먼저 실행)`);
}

/** [출력 이름, 원본 경로, 최대 변, 옵션] */
const jobs = [
  ...Object.entries(pptMap).map(([name, [file, max, opts]]) => [name, path.join(pptDir, file), max, opts]),
  ...Object.entries(pdfMap).flatMap(([slug, files]) =>
    files.map((rel, i) => [i === 0 ? `cp-${slug}` : `cp-${slug}-${i + 1}`, pdfFile(rel), i === 0 ? 1400 : 1000]),
  ),
];

const entries = [];
const dims = {};
let total = 0;
for (const [name, file, max, opts = {}] of jobs) {
  let img = sharp(file).rotate();
  if (opts.extract) img = sharp(await img.extract(opts.extract).trim().toBuffer());
  img = img.resize(max, max, { fit: "inside", withoutEnlargement: true });
  const ext = opts.png ? "png" : "webp";
  const target = path.join(out, `${name}.${ext}`);
  const info = await (opts.png ? img.png({ compressionLevel: 9, palette: true }) : img.webp({ quality: 82 })).toFile(target);
  total += info.size;
  dims[name] = { width: info.width, height: info.height };
  entries.push(`  "${name}": { src: "/photos/${name}.${ext}", width: ${info.width}, height: ${info.height} },`);
  console.log(`${name}.${ext} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB  ← ${path.basename(file)}`);
}
writeFileSync(
  path.join(process.cwd(), "src", "content", "photos.generated.ts"),
  `/** scripts/import-photos.mjs 가 생성한 파일 — 직접 수정하지 말 것 */\nexport const photos = {\n${entries.join("\n")}\n} as const;\n\nexport type PhotoName = keyof typeof photos;\n`,
);
writeFileSync(path.join(process.cwd(), "src", "content", "photos.dims.json"), JSON.stringify(dims, null, 2) + "\n");
console.log(`\n${entries.length}장, 총 ${(total / 1024 / 1024).toFixed(2)}MB → public/photos/`);
