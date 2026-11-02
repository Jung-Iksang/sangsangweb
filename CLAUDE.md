# CLAUDE.md

@AGENTS.md

## 프로젝트 개요

상상마루(SangsangMaru) — 전북 익산 진로·직업체험 교육 기관 홈페이지. 2026-10 리뉴얼:
기존 정적 HTML + PHP(미리넷) → **Next.js 16 (App Router, Cache Components) + Vercel(호스팅 · Neon DB · Blob 사진 저장소 — 가입·결제 한 곳)**.
기존 사이트는 `old/` 에 보관(배포 대상 아님). 디자인 레퍼런스: hamsungedu.co.kr (레이아웃 느낌만 차용).

**클라이언트 최우선 요구: 구글·네이버 SEO.** 공개 페이지는 반드시 서버에서 완성된 HTML 로 나가야 한다.

**회사 정보의 출처는 기업소개 PDF/PPT(저장소 루트, git 제외)다.** 진로·직업체험 프로그램은 2026 운영계획(안)·요약 PDF(같은 위치) → `src/content/career-programs.ts`. `old/` 의 예전 문구(2020년 설립, 원광대 프라임관, 1544-0634 등)는 사실이 아니므로 쓰지 말 것.
사진은 `photos["이름"]`(`src/content/photos.generated.ts`, `npm run import-photos -- --ppt … --pdf …` 로 생성, PDF 추출은 `scripts/extract-pdf-images.swift`)으로만 참조. 진로·직업체험 사진은 `cp-<slug>`.

## 핵심 규칙

- **Next 16 은 학습 데이터와 다름** — 코드 작성 전 `node_modules/next/dist/docs/` 확인 (middleware → `src/proxy.ts`, `"use cache"`/`cacheTag`/`updateTag`, `instant`).
- 공개 데이터는 `src/lib/data.ts` 의 `"use cache"` 함수로만 조회 → 정적 셸에 포함(SEO). 수정은 `src/actions/admin.ts` 에서 `updateTag("posts"|"gallery")`.
- 동적 라우트(`[id]`, `[slug]`, `page/[page]`)는 params 를 최상위에서 await + `export const instant = false` (크롤러에 완성 HTML·정확한 404). `generateStaticParams` 는 최소 1개 반환(없으면 placeholder).
- 페이지네이션은 쿼리스트링 대신 경로(`/community/notice/page/2`).
- 모든 공개 페이지는 `pageMetadata()`(`src/lib/seo.tsx`)로 title/description/canonical/OG 지정. 루트 레이아웃에 canonical 두지 말 것.
- `next.config.ts` 의 `htmlLimitedBots` 에 Yeti(네이버)·Daum·Googlebot 포함 → 봇은 스트리밍 없는 완성 HTML 수신.
- 메뉴 변경은 `src/config/menu.ts` 한 곳만. 진로·직업체험 하위 메뉴는 `careerThemes` 에서 자동 생성.
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
src/content/         programs.ts career-programs.ts about.ts career.ts (정적 콘텐츠)
src/db/              schema.ts(drizzle) bootstrap.sql index.ts(연결)
src/lib/             data.ts(공개·캐시) admin-data.ts auth.ts storage.ts seo.tsx html.ts
scripts/             local-db.mjs(로컬 PGlite HTTP 서버) db-init.mjs gen-mock.mjs hash-password.mjs
```

## DB 연결

- 운영: `DATABASE_URL`(Neon) → `drizzle-orm/neon-http`
- 로컬: `npm run dev` 가 `scripts/local-db.mjs` 실행 → PGlite 를 단일 프로세스가 소유하고 HTTP 로 제공 → `LOCAL_DB_URL` + `drizzle-orm/pg-proxy`
  (Next 개발 서버는 여러 워커/캐시 컨텍스트를 쓰므로 PGlite 파일을 직접 열면 손상됨 — 직접 열지 말 것)
- 스키마 변경 시 `schema.ts` 와 `bootstrap.sql` 을 함께 수정. neon-http 는 트랜잭션이 없으니 여러 문장은 순차 실행.
- 갤러리 = 앨범: `gallery` 행이 대표 사진, 나머지는 `gallery_images`(sort_order). 관리자 `/admin/gallery`(새 앨범) · `/admin/gallery/[id]`(사진 관리).
- 강사 현장 사진 = `gallery.program_slug`(career-programs slug, 액션에서 화이트리스트 검증) → `getFieldPhotos(theme)` 가 `/career/[theme]` 프로그램 카드 아래에 최신순 표시.

## 디자인 — 화이트 + 블루 (v1.8)

v1.8 = PR #3(블루 디자인) 채택 + 서브페이지 틀·진로·직업체험·사진은 v1.7 유지.
`src/app/globals.css` `@theme` 토큰만 사용 (임의 색 hex 금지 — 컴포넌트 CSS 파일 포함, 네이버/카카오 지도·스토어 버튼 브랜드색만 예외).
- 바탕 `paper`(#FFFFFF) / `cream`(#F3F6FB — 교차 띠·표 머리·hover) / `white`(카드), 글자 `ink`(#172F4E) `body`(#3C5069) `muted`(#5E7086), 선 `line`(#DCE4EF) `line-strong`
- 주색 `blue`(#215EAC — 링크·활성·주 버튼·번호) / `blue-dark`(hover) / `blue-soft`·`blue-mist`(히어로 바탕·장식), `navy`(#142D4E), 노랑은 `hl` 형광펜 밑줄로만, `red` 는 NEW·에러, 로고 원색 `brand-*` 은 8px 이하 점에만, `turf`/`turf-dark` 는 드론축구장 띠 전용
- 그라데이션은 `grad-brand`(사이드메뉴 섹션 블록, 흰 글자) · `grad-band`(서브 타이틀 띠) 두 유틸리티로만 — 그 밖의 그라데이션·임의 hex 금지
- 푸터는 `ink` 바탕 + `on-ink*` 글자, v1.7 3단(로고·주소 | 바로가기 | 인증·지정) + 하단 사업자 정보 줄
- 유틸리티: `t-display/t-h1/t-h2/t-h3/t-lead`, `num`, `hl`, `btn` + `btn-primary/btn-outline/btn-dark/btn-ghost/btn-sm`, `link-more`, `turf`(드론축구장 잔디 — 메인 02 프로그램 띠, 일러스트는 `Programs.tsx`), `container-site`(헤더·히어로·메인 공통, 최대 1430px·좌우 30px — `Header.css` 의 `.site-header-frame`·`.hero-layout` 과 같은 값) · `container-read`(서브페이지 본문 1320px)
- 글자 체계: `src/styles/typography.css`(`--type-*` 변수·`.type-*` 클래스, `.public-site` 래퍼 범위 — `(site)/layout.tsx`). 이 파일은 레이어 밖 CSS 라 Tailwind 유틸리티보다 우선함에 주의
- 라운드 `rounded-sm`(6) / `rounded-md`(10) / `rounded-btn`(8)
- **금지**: `rounded-full` 칩·버튼(8px 이하 점·원형 캐러셀 버튼 제외), `grad-*` 외 그라데이션, 대문자 영문 소제목(eyebrow), 제목 옆 세로 막대, 카드 기본 그림자(서브페이지 메뉴 카드만 예외), 사진 위 글자 오버레이
  (hover 떠오름은 메인 사진 카드(프로그램·진로체험·갤러리)만 — 6px 위로 + `shadow-lift`, `motion-safe`)
  (사진 위 글자는 히어로·카드의 작은 캡션/분류 라벨만 허용 — 스크림·큰 흰 글자 없음)
- 폰트 **Paperlogy 하나**(본문 500·라벨 600·제목 700·큰 숫자 800, 완성형 서브셋, `public/fonts/paperlogy/`, `npm run fetch-paperlogy`) + Pretendard Variable 폴백(`public/fonts/pretendard/`). `next/font/local` 등으로 다른 글꼴 추가 금지
- 헤더 2단: 위 블루 안내 줄(기관명·슬로건 | 공지사항·오시는 길·교육문의 전화) + 로고·주 메뉴(메가메뉴 `MainNav.tsx`). 메뉴 줄에 문의 버튼 두지 않음(안내 줄과 중복). `--header-h` 는 `Header.css` 가 두 줄 합으로 계산 — sticky·앵커는 이 변수 사용
- 메인: `Hero`(왼쪽 사진 캐러셀 / 오른쪽 위 "호기심 충전소" 카드 — 캘리그라피 + 아이·드론·로봇 일러스트 / 오른쪽 아래 안내 카드 + 바로가기) → `AboutIntro`(`ScrollReveal`) → `CareerSection`(대표 6개 분야, cp-* 사진) → `Programs`(turf) → `NewsBoards`(공지사항 | 포토갤러리) → `Partners`
- 서브페이지는 `SubPage`(가운데 타이틀 띠 + 떠 있는 좌측 메뉴 카드). 상세 글은 `bandTitle`=게시판 이름, 글 제목은 `DetailHead` h1(페이지마다 h1 다르게 — SEO). 커뮤니티: 공지·보도 표, 포토갤러리 3열 카드, 상세 하단 먹색 `목록` + `PrevNext` 2칸 바. 연혁은 `HistoryTimeline`
- 명칭은 "포토갤러리"(메뉴·메타·관리자 모두)

## 검증

`npm run lint && npm run typecheck && npm test && npm run build`. 크롤러 확인: `curl -A "Yeti" <url>` 로 본문·메타가 HTML 에 있는지 확인.
