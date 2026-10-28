import "server-only";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as schema from "./schema";

/**
 * DB 연결
 * - DATABASE_URL (Neon)  → Neon 서버리스 HTTP 드라이버 (운영 · Vercel)
 * - LOCAL_DB_URL          → 로컬 개발 DB 서버 (`npm run dev` 가 자동 실행 · scripts/local-db.mjs)
 * - 둘 다 없음            → next build 중에만 빈 메모리 DB 허용 (그 외에는 오류)
 */
export type Db = PgDatabase<PgQueryResultHKT, typeof schema>;

async function connect(): Promise<Db> {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { neon } = await import("@neondatabase/serverless");
    const { drizzle } = await import("drizzle-orm/neon-http");
    return drizzle({ client: neon(url), schema }) as unknown as Db;
  }

  const local = process.env.LOCAL_DB_URL;
  if (local) {
    const { drizzle } = await import("drizzle-orm/pg-proxy");
    return drizzle(
      async (sql, params, method) => {
        const res = await fetch(`${local}/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sql, params, method }),
          cache: "no-store",
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "local db error");
        return json;
      },
      { schema },
    ) as unknown as Db;
  }

  if (process.env.NEXT_PHASE === "phase-production-build") {
    console.warn("[db] DATABASE_URL 없음 — 빈 메모리 DB로 빌드합니다. (운영 배포 시에는 반드시 설정하세요)");
    const { PGlite } = await import("@electric-sql/pglite");
    const { drizzle } = await import("drizzle-orm/pglite");
    const { readFile } = await import("node:fs/promises");
    const client = new PGlite();
    await client.exec(await readFile(`${process.cwd()}/src/db/bootstrap.sql`, "utf8"));
    return drizzle({ client, schema }) as unknown as Db;
  }

  throw new Error(
    "DB 연결 정보가 없습니다. 로컬에서는 `npm run dev` 로 실행하고, 운영에서는 DATABASE_URL(Neon)을 설정하세요.",
  );
}

const g = globalThis as unknown as { __dbPromise?: Promise<Db> };

export function getDb(): Promise<Db> {
  if (!g.__dbPromise) {
    g.__dbPromise = connect();
    g.__dbPromise.catch(() => {
      g.__dbPromise = undefined;
    });
  }
  return g.__dbPromise;
}

export { schema };
