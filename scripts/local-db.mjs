// 로컬 개발용 내장 Postgres (PGlite) — 한 프로세스가 DB를 소유하고 HTTP로 쿼리를 받는다.
// (Next 개발 서버는 여러 워커 프로세스를 쓰므로 DB 파일을 직접 열면 손상됨 → 이 서버를 통해 공유)
// - .data/pglite 에 데이터 저장, 첫 실행 시 테이블 생성 + 예시 데이터 입력
// - 사용: `npm run dev` (DB 서버 + next dev 동시 실행) / `npm run db:local` (DB 서버만)
// - 운영(Vercel)에서는 사용하지 않음 — DATABASE_URL(Neon) 사용
import { spawn } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import http from "node:http";
import path from "node:path";
import { PGlite } from "@electric-sql/pglite";

const root = process.cwd();
const PORT = Number(process.env.LOCAL_DB_PORT || 54329);
const dataDir = path.join(root, ".data", "pglite");
mkdirSync(dataDir, { recursive: true });

const db = await PGlite.create(dataDir);
await db.exec(readFileSync(path.join(root, "src/db/bootstrap.sql"), "utf8"));
await seed(db);
await seedAlbums(db);
await seedProgramLinks(db);

// drizzle-orm/pg-proxy 규약: method "all" → 행을 값 배열로, "execute" → 객체로
const server = http.createServer((req, res) => {
  if (req.method !== "POST" || req.url !== "/query") {
    res.writeHead(404).end();
    return;
  }
  let body = "";
  req.on("data", (c) => (body += c));
  req.on("end", async () => {
    try {
      const { sql, params, method } = JSON.parse(body);
      const result = await db.query(
        sql,
        params ?? [],
        method === "all" ? { rowMode: "array" } : undefined,
      );
      res
        .writeHead(200, { "Content-Type": "application/json" })
        .end(JSON.stringify({ rows: result.rows }));
    } catch (err) {
      res
        .writeHead(500, { "Content-Type": "application/json" })
        .end(JSON.stringify({ error: String(err?.message ?? err) }));
    }
  });
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
const url = `http://127.0.0.1:${PORT}`;
console.log(
  `\n  ▶ 로컬 DB 서버: ${url}  (데이터: .data/pglite · 초기화하려면 폴더 삭제)\n`,
);

let child;
let shuttingDown = false;

const runIdx = process.argv.indexOf("--run");

if (runIdx > -1) {
  const cmd = process.argv.slice(runIdx + 1);

  // Windows / macOS 공통 Next.js 실행
  const nextCli = path.join(
    root,
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );

  child = spawn(process.execPath, [nextCli, ...cmd.slice(1)], {
    stdio: "inherit",
    env: {
      ...process.env,
      LOCAL_DB_URL: url,
    },
  });

  // Next.js 종료 시 로컬 DB 정리
  child.once("exit", (code, signal) => {
    void shutdown(code ?? (signal ? 0 : 1));
  });

  // Next.js 실행 오류 처리
  child.once("error", (err) => {
    console.error("Next.js 실행 오류:", err);
    void shutdown(1);
  });
}

async function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;

  try {
    // HTTP 서버 종료 완료 대기
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // PGlite 종료
    await db.close();

    console.log("▶ 로컬 DB 서버 종료 완료");
  } catch (err) {
    console.error("로컬 DB 종료 오류:", err);
    code = 1;
  } finally {
    process.exit(code);
  }
}

// Ctrl + C 종료 처리
function handleSignal(signal) {
  if (child && child.exitCode === null && child.signalCode === null) {
    if (!child.kill(signal)) {
      void shutdown(1);
    }
  } else {
    void shutdown();
  }
}

process.on("SIGINT", () => handleSignal("SIGINT"));
process.on("SIGTERM", () => handleSignal("SIGTERM"));

/** 비어 있으면 화면 확인용 예시 데이터 입력 (로컬 전용) */
async function seed(pg) {
  const { rows } = await pg.query("SELECT count(*)::int AS n FROM posts");
  if (rows[0].n > 0) return;
  const day = 86400000;
  const base = new Date("2026-10-20T09:00:00+09:00").getTime();
  const html = (b) =>
    `<p>${b}</p><h2>안내</h2><ul><li>장소: 상상마루 창의공학실 (익산시 동서로49길 24-1, 2층)</li><li>문의: 063-836-3383 · steamsci@hanmail.net</li></ul><p>자세한 사항은 상상마루로 문의해 주세요.</p>`;
  const notice = [
    [
      "2026 겨울방학 학교밖 늘봄학교 참가자 모집",
      "익산교육지원청 학교밖 늘봄학교 겨울방학 프로그램 참가자를 모집합니다.",
    ],
    [
      "탑마루드론축구단 신규 단원 모집",
      "드론축구에 관심 있는 청소년의 많은 지원 바랍니다.",
    ],
    [
      "민간자격 강사양성과정(드론교육지도사·로봇코딩지도사) 수강생 모집",
      "자유학년제·방과후 강사를 준비하는 분들을 위한 과정입니다.",
    ],
    [
      "4차산업 진로체험 스쿨 학교 신청 안내",
      "드론·3D프린터·코딩·VR/AR·로봇·IoT 진로체험 수업을 신청받습니다.",
    ],
    ["홈페이지 리뉴얼 오픈 안내", "상상마루 홈페이지가 새롭게 단장했습니다."],
    [
      "제3회 청소년 드론축구 SW Festival 개최 예정",
      "대회 일정과 참가 방법은 추후 공지합니다.",
    ],
  ];
  const press = [
    [
      "상상마루, 교육부 교육기부 진로체험 인증기관 재인증",
      "인증기간은 2023년 7월 5일부터 2026년 7월 4일까지입니다.",
    ],
    [
      "익산드론축구단, 다문화가족과 함께 드론축구 훈련",
      "익산시가족센터와 함께하는 익산드론축구단이 활동을 이어가고 있습니다.",
    ],
    [
      "상상마루 기업부설연구소 '상상연구소' 인정",
      "한국산업기술진흥협회로부터 기업부설연구소로 인정받았습니다.",
    ],
    [
      "백제문양 문화상품, 국립부여·공주박물관 문화상품점 입점",
      "상상마루가 개발한 백제문양 LED 체험 키트가 박물관 문화상품점에 입점했습니다.",
    ],
    [
      "제2회 청소년 드론축구 SW Festival 성료",
      "익산시청소년수련관에서 청소년 드론축구 대회와 SW 진로체험부스를 운영했습니다.",
    ],
  ];
  const pressPhotos = [
    "cert-moe",
    "drone-iksan",
    "cert-lab",
    "culture",
    "events-swfestival-poster-2",
  ];
  const insert = async (board, list, offset) => {
    for (const [i, [t, b]] of list.entries()) {
      const at = new Date(base - i * 4 * day - offset * day).toISOString();
      const thumb = board === "press" ? `/photos/${pressPhotos[i]}.webp` : null;
      const body = thumb
        ? `<img src="${thumb}" alt="${t}" />${html(b)}`
        : html(b);
      await pg.query(
        "INSERT INTO posts (board_type,title,content,excerpt,thumbnail_url,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$6)",
        [
          board,
          t,
          body,
          `${b} 장소: 상상마루 창의공학실 / 문의: 063-836-3383`,
          thumb,
          at,
        ],
      );
    }
  };
  await insert("notice", notice, 0);
  await insert("press", press, 1);
  const gallery = [
    ["2017 코리아 드론축구 페스티벌 참가", "drone-festival"],
    ["익산드론축구단 단체 사진", "drone-iksan"],
    ["탑마루 선화공주 드론축구단", "drone-seonhwa"],
    ["전라북도창의융합축전 현장", "events-festival"],
    ["하노이탑대회 체험부스", "events-hanoi"],
    ["유아과학페스티벌", "events-kids-2"],
    ["학교밖 방과후마을학교 코딩 수업", "afterschool"],
    ["3D펜 메이커 활동", "neulbom"],
    ["백제문양 LED 주사위 만들기", "culture"],
    ["강사양성과정 수료식", "instructor"],
  ];
  const dims = JSON.parse(
    readFileSync(path.join(root, "src/content/photos.dims.json"), "utf8"),
  );
  for (const [i, [t, name]] of gallery.entries()) {
    const d = dims[name] ?? { width: 1200, height: 900 };
    await pg.query(
      "INSERT INTO gallery (title,image_url,width,height,created_at) VALUES ($1,$2,$3,$4,$5)",
      [
        t,
        `/photos/${name}.webp`,
        d.width,
        d.height,
        new Date(base - i * 3 * day).toISOString(),
      ],
    );
  }
  console.log(
    "  ▶ 예시 데이터를 입력했습니다 (공지 6 · 보도 5 · 사진 10, 기업소개 자료 기반)",
  );
}

/** v1.4 앨범: 예시 갤러리에 추가 사진을 붙인다 (gallery_images 가 비어 있고, 예시 사진(/photos/)만 있을 때만) */
async function seedAlbums(pg) {
  const { rows: done } = await pg.query("SELECT count(*)::int AS n FROM gallery_images");
  const { rows: real } = await pg.query("SELECT count(*)::int AS n FROM gallery WHERE image_url NOT LIKE '/photos/%'");
  if (done[0].n > 0 || real[0].n > 0) return;
  const extras = {
    "drone-festival": ["drone-festival-2", "drone-team", "drone-class"],
    "drone-iksan": ["drone-iksan-2", "drone-jeonju"],
    "events-festival": ["events-festival-2", "events-festival-3", "events-festival-poster"],
    "events-kids-2": ["events-kids-1", "events-kids-3"],
    culture: ["culture-stringart", "culture-hologram"],
    instructor: ["instructor-lecture"],
  };
  const dims = JSON.parse(readFileSync(path.join(root, "src/content/photos.dims.json"), "utf8"));
  let n = 0;
  for (const [cover, names] of Object.entries(extras)) {
    const { rows } = await pg.query("SELECT id FROM gallery WHERE image_url = $1", [`/photos/${cover}.webp`]);
    if (!rows[0]) continue;
    for (const [i, name] of names.entries()) {
      const d = dims[name] ?? { width: 1200, height: 900 };
      await pg.query(
        "INSERT INTO gallery_images (gallery_id,image_url,width,height,sort_order) VALUES ($1,$2,$3,$4,$5)",
        [rows[0].id, `/photos/${name}.webp`, d.width, d.height, i],
      );
      n++;
    }
  }
  if (n) console.log(`  ▶ 예시 앨범 사진 ${n}장을 추가했습니다`);
}

/** v1.7 강사 현장 사진: 예시 앨범 몇 개를 진로·직업체험 프로그램에 연결 (예시 사진만 있고 연결이 하나도 없을 때만) */
async function seedProgramLinks(pg) {
  const { rows: linked } = await pg.query("SELECT count(*)::int AS n FROM gallery WHERE program_slug IS NOT NULL");
  const { rows: real } = await pg.query("SELECT count(*)::int AS n FROM gallery WHERE image_url NOT LIKE '/photos/%'");
  if (linked[0].n > 0 || real[0].n > 0) return;
  const links = {
    "drone-festival": "drone-soccer-class",
    "drone-iksan": "drone-soccer-class",
    culture: "baekje-hanji-lamp",
    "events-kids-2": "science-1",
  };
  let n = 0;
  for (const [cover, slug] of Object.entries(links)) {
    const r = await pg.query("UPDATE gallery SET program_slug = $1 WHERE image_url = $2", [slug, `/photos/${cover}.webp`]);
    n += r.affectedRows ?? 0;
  }
  if (n) console.log(`  ▶ 예시 앨범 ${n}개를 진로·직업체험 프로그램에 연결했습니다 (현장 사진 확인용)`);
}
