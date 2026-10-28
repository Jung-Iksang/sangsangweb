// 운영 DB(Neon)에 테이블 생성 — 여러 번 실행해도 안전 (CREATE ... IF NOT EXISTS)
// 사용: DATABASE_URL='postgresql://...neon.tech/...' npm run db:init
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL 을 지정하세요.  예) DATABASE_URL='postgresql://...' npm run db:init");
  process.exit(1);
}
const sql = neon(url);
const statements = readFileSync(new URL("../src/db/bootstrap.sql", import.meta.url), "utf8")
  .split("\n")
  .filter((l) => !l.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const s of statements) {
  await sql.query(s);
  console.log("✓", s.split("\n")[0]);
}
console.log("완료: posts, gallery 테이블 준비됨");
