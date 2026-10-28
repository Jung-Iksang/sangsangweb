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
      const result = await db.query(sql, params ?? [], method === "all" ? { rowMode: "array" } : undefined);
      res.writeHead(200, { "Content-Type": "application/json" }).end(JSON.stringify({ rows: result.rows }));
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" }).end(JSON.stringify({ error: String(err?.message ?? err) }));
    }
  });
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));
const url = `http://127.0.0.1:${PORT}`;
console.log(`\n  ▶ 로컬 DB 서버: ${url}  (데이터: .data/pglite · 초기화하려면 폴더 삭제)\n`);

let child;
const runIdx = process.argv.indexOf("--run");
if (runIdx > -1) {
  const cmd = process.argv.slice(runIdx + 1);
  child = spawn("npx", cmd, { stdio: "inherit", env: { ...process.env, LOCAL_DB_URL: url } });
  child.on("exit", (code) => shutdown(code ?? 0));
}

async function shutdown(code = 0) {
  try {
    server.close();
    await db.close();
  } finally {
    process.exit(code);
  }
}
process.on("SIGINT", () => (child ? child.kill("SIGINT") : shutdown()));
process.on("SIGTERM", () => (child ? child.kill("SIGTERM") : shutdown()));

/** 비어 있으면 화면 확인용 예시 데이터 입력 (로컬 전용) */
async function seed(pg) {
  const { rows } = await pg.query("SELECT count(*)::int AS n FROM posts");
  if (rows[0].n > 0) return;
  const day = 86400000;
  const base = new Date("2026-10-20T09:00:00+09:00").getTime();
  const html = (b) =>
    `<p>${b}</p><h2>주요 내용</h2><ul><li>대상: 초·중·고 학생</li><li>장소: 원광대학교 프라임관</li><li>문의: 1544-0634</li></ul><p>자세한 사항은 상상마루로 문의해 주세요.</p>`;
  const notice = [
    ["2026 하반기 SW·AI 교육주간 참가 학교 모집", "SW·AI 교육주간에 참여할 학교를 모집합니다."],
    ["겨울방학 늘봄교육 프로그램 안내", "겨울방학 기간 늘봄교육 프로그램 일정을 안내드립니다."],
    ["탑마루드론축구단 신규 단원 모집", "드론축구에 관심 있는 학생들의 많은 지원 바랍니다."],
    ["홈페이지 리뉴얼 오픈 안내", "상상마루 홈페이지가 새롭게 단장했습니다."],
    ["HRD-Net 강사양성과정 11월 기수 모집", "강사양성과정 11월 기수 교육생을 모집합니다."],
    ["과학의날 행사 지원 신청 안내", "학교·지역 과학 행사 지원 신청을 받습니다."],
  ];
  const press = [
    ["상상마루, 익산교육지원청과 진로체험 협력 MOU 체결", "지역 학생들의 진로체험 기회 확대를 위한 협약을 체결했습니다."],
    ["탑마루드론축구단, 전북 드론축구 대회 입상", "탑마루드론축구단이 대회에서 우수한 성적을 거두었습니다."],
    ["지역사회 교육 협력으로 학교밖 늘봄교육 확대", "지역 기관과 함께하는 늘봄교육이 확대 운영됩니다."],
    ["교육기부 진로체험, 현직 전문가 멘토 30명 참여", "다양한 분야의 전문가가 재능기부에 참여했습니다."],
    ["SW·AI 교육주간 성료… 학생 500여 명 참여", "코딩과 인공지능을 체험한 교육주간이 마무리되었습니다."],
  ];
  const insert = async (board, list, offset) => {
    for (const [i, [t, b]] of list.entries()) {
      const at = new Date(base - i * 4 * day - offset * day).toISOString();
      await pg.query(
        "INSERT INTO posts (board_type,title,content,excerpt,thumbnail_url,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$6)",
        [board, t, html(b), `${b} 대상: 초·중·고 학생 / 장소: 원광대학교 프라임관 / 문의: 1544-0634`, board === "press" ? `/mock/gallery-${i + 1}.svg` : null, at],
      );
    }
  };
  await insert("notice", notice, 0);
  await insert("press", press, 1);
  const titles = ["SW·AI 교육주간 현장", "드론축구 훈련", "과학의날 체험부스", "늘봄교실 만들기 활동", "문화예술 공예 체험", "직업인 멘토링 특강", "자유학년제 진로탐색", "메이커 3D 프린팅", "학교밖 현장체험", "강사양성과정 수료식"];
  for (const [i, t] of titles.entries()) {
    await pg.query("INSERT INTO gallery (title,image_url,width,height,created_at) VALUES ($1,$2,1200,900,$3)", [
      t,
      `/mock/gallery-${i + 1}.svg`,
      new Date(base - i * 3 * day).toISOString(),
    ]);
  }
  console.log("  ▶ 예시 데이터를 입력했습니다 (공지 6 · 보도 5 · 사진 10)");
}
