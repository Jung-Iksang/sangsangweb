import { defineConfig } from "drizzle-kit";

// 스키마 변경 시 마이그레이션 생성용 (최초 테이블 생성은 `npm run db:init`)
export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
