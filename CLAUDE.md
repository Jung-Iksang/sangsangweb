# CLAUDE.md

@AGENTS.md

## 프로젝트 개요

상상마루(SangsangMaru) — 전북 익산 진로·직업체험 교육 기관 홈페이지. 2026-10 리뉴얼:
기존 정적 HTML + PHP(미리넷) → **Next.js 16 (App Router, Cache Components) + Vercel + Neon + AWS S3/CloudFront**.
기존 사이트는 `old/` 에 보관(배포 대상 아님). 디자인 레퍼런스: hamsungedu.co.kr (레이아웃 느낌만 차용).

**클라이언트 최우선 요구: 구글·네이버 SEO.** 공개 페이지는 반드시 서버에서 완성된 HTML 로 나가야 한다.

**회사 정보의 출처는 기업소개 PDF/PPT(저장소 루트, git 제외)다.** `old/` 의 예전 문구(2020년 설립, 원광대 프라임관, 1544-0634 등)는 사실이 아니므로 쓰지 말 것.
사진은 `photos["이름"]`(`src/content/photos.generated.ts`, `npm run import-photos` 로 생성)으로만 참조.

## 핵심 규칙

- **Next 16 은 학습 데이터와 다름** — 코드 작성 전 `node_modules/next/dist/docs/` 확인 (middleware → `src/proxy.ts`, `"use cache"`/`cacheTag`/`updateTag`, `instant`).
- 공개 데이터는 `src/lib/data.ts` 의 `"use cache"` 함수로만 조회 → 정적 셸에 포함(SEO). 수정은 `src/actions/admin.ts` 에서 `updateTag("posts"|"gallery")`.
- 동적 라우트(`[id]`, `[slug]`, `page/[page]`)는 params 를 최상위에서 await + `export const instant = false` (크롤러에 완성 HTML·정확한 404). `generateStaticParams` 는 최소 1개 반환(없으면 placeholder).
- 페이지네이션은 쿼리스트링 대신 경로(`/community/notice/page/2`).
- 모든 공개 페이지는 `pageMetadata()`(`src/lib/seo.tsx`)로 title/description/canonical/OG 지정. 루트 레이아웃에 canonical 두지 말 것.
- `next.config.ts` 의 `htmlLimitedBots` 에 Yeti(네이버)·Daum·Googlebot 포함 → 봇은 스트리밍 없는 완성 HTML 수신.
- 메뉴 변경은 `src/config/menu.ts` 한 곳만.
- 관리자: 단일 계정(환경변수 `ADMIN_ID`/`ADMIN_PASSWORD_HASH`/`AUTH_SECRET`), `/admin/*` 는 proxy + `requireAdmin()` 이중 확인, noindex.
- 게시글 HTML 은 저장 시 `sanitizePostHtml()` 로 정제.

## 구조

```
src/app/(site)/      공개 페이지 (헤더/푸터 포함)
src/app/admin/       관리자 (login, (panel)/…)
src/app/api/admin/   업로드 URL 발급, 로컬 업로드 수신
src/app/sitemap.ts · robots.ts · rss.xml/  SEO 파일
src/components/      layout/ home/ community/ admin/ ui/
src/config/          site.ts(회사정보) menu.ts(메뉴)
src/content/         programs.ts about.ts career.ts (정적 콘텐츠)
src/db/              schema.ts(drizzle) bootstrap.sql index.ts(연결)
src/lib/             data.ts(공개·캐시) admin-data.ts auth.ts storage.ts seo.tsx html.ts
scripts/             local-db.mjs(로컬 PGlite HTTP 서버) db-init.mjs gen-mock.mjs hash-password.mjs
```

## DB 연결

- 운영: `DATABASE_URL`(Neon) → `drizzle-orm/neon-http`
- 로컬: `npm run dev` 가 `scripts/local-db.mjs` 실행 → PGlite 를 단일 프로세스가 소유하고 HTTP 로 제공 → `LOCAL_DB_URL` + `drizzle-orm/pg-proxy`
  (Next 개발 서버는 여러 워커/캐시 컨텍스트를 쓰므로 PGlite 파일을 직접 열면 손상됨 — 직접 열지 말 것)
- 스키마 변경 시 `schema.ts` 와 `bootstrap.sql` 을 함께 수정.

## 디자인 토큰

`src/app/globals.css` `@theme`: primary `#1F63C9`, 로고색 green/yellow/red (글자에는 `-ink` 변형 사용 — 명도 대비 4.5:1),
컨테이너 1160px(`container-site`), 네비 75px, 라운드 20px(카드)/50px(버튼)/15px(입력). 폰트 Spoqa Han Sans Neo(`src/fonts`, 자체 호스팅).

## 검증

`npm run lint && npm run typecheck && npm run build`. 크롤러 확인: `curl -A "Yeti" <url>` 로 본문·메타가 HTML 에 있는지 확인.
