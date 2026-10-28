-- 테이블 생성 (src/db/schema.ts 와 동일하게 유지)
-- 운영(Neon)은 `npm run db:push` 또는 이 SQL을 Neon 콘솔 SQL Editor 에서 실행
CREATE TABLE IF NOT EXISTS posts (
  id serial PRIMARY KEY,
  board_type varchar(20) NOT NULL,
  title varchar(255) NOT NULL,
  content text NOT NULL,
  excerpt varchar(300) NOT NULL DEFAULT '',
  thumbnail_url text,
  views integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS posts_board_created_idx ON posts (board_type, created_at);
CREATE TABLE IF NOT EXISTS gallery (
  id serial PRIMARY KEY,
  title varchar(255) NOT NULL,
  description varchar(500) NOT NULL DEFAULT '',
  image_url text NOT NULL,
  storage_key text,
  width integer NOT NULL DEFAULT 1200,
  height integer NOT NULL DEFAULT 900,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS gallery_created_idx ON gallery (created_at);
