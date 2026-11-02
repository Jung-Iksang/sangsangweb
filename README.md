# 상상마루 홈페이지

유한회사 상상마루(전북 익산 진로·직업체험 교육 기관) 공식 홈페이지입니다.
기존 정적 HTML + PHP(미리넷 호스팅) 사이트를 **Next.js 16 + Vercel(호스팅 · Neon Postgres · Blob 사진 저장소)** 로 새로 만들었습니다. 가입·결제는 Vercel 한 곳입니다.

> **현재 버전: v1.5 — 흰 바탕 + 키위 그린 · Paperlogy · 서브페이지 틀 · 갤러리 앨범**
> 회사 정보·사진은 기업소개 PDF/PPT 기준(v1.1), 디자인은 크림 바탕·로고 초록 주색·번호 매긴 섹션(v1.2). v1.3 에서 화면 폭 대응, 헤더 메가메뉴, 메인 첫 화면과 프로그램 섹션을 다듬었고, v1.4 에서 글꼴을 Paperlogy 로 바꾸고 서브페이지·공지사항·포토갤러리를 isedu.kr 레이아웃 느낌으로 다시 짰습니다(갤러리는 여러 장 앨범). v1.6 에서 AWS 를 빼고 Vercel 하나(호스팅·Neon·Blob)로 묶었습니다. v1.7 에서 진로·직업체험을 2026 운영계획(안) PDF 기준 9개 분야 82개 프로그램으로 바꾸고, 강사가 관리자 화면에서 올린 현장 사진이 프로그램별로 쌓이게 했습니다. 운영 연결(Vercel 팀 생성·도메인)은 아직입니다.
> 남은 작업은 [로드맵](#로드맵--남은-작업)을 보세요. 변경 이력은 [CHANGELOG.md](CHANGELOG.md).

- 클라이언트 최우선 요구: **구글·네이버 검색 노출(SEO)**
- 디자인 레퍼런스: https://hamsungedu.co.kr (레이아웃 느낌만 차용, 상단 메뉴는 기존 사이트 구성 유지)
- 기존 사이트 보관본: `old/` (참고용, 배포되지 않음)
- 배포 절차: [docs/DEPLOY.md](docs/DEPLOY.md)

---

## 목차

1. [기술 스택](#기술-스택)
2. [빠른 시작](#빠른-시작)
3. [폴더 구조](#폴더-구조)
4. [아키텍처](#아키텍처)
5. [DB 스키마](#db-스키마)
6. [백엔드 작업 가이드](#백엔드-작업-가이드)
7. [환경변수](#환경변수)
8. [명령어](#명령어)
9. [콘텐츠 수정 위치](#콘텐츠-수정-위치)
10. [로드맵 / 남은 작업](#로드맵--남은-작업)
11. [주의사항](#주의사항)

---

## 기술 스택

| 영역 | 사용 기술 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 16.4 (App Router, **Cache Components**), React 19 | 학습 자료와 API가 다름 → 아래 [주의사항](#주의사항) |
| 스타일 | Tailwind CSS 4 + 디자인 토큰(`src/app/globals.css`) | 폰트 Paperlogy(본문·제목, 완성형 서브셋) + Pretendard Variable(폴백) 자체 호스팅 |
| DB | Postgres — 운영 Neon / 로컬 PGlite | ORM: Drizzle |
| 이미지 | Vercel Blob — 로컬은 `.data/uploads` | 브라우저 → Blob 직접 업로드(client upload, `@vercel/blob`) |
| 인증 | 단일 관리자, 환경변수 + JWT 쿠키(jose) | 일반 회원 기능 없음 |
| 에디터 | Tiptap 3 | 게시글 본문 |
| 호스팅 | Vercel (Neon·Blob 도 Vercel Marketplace 에서 생성 → 청구서 하나) | 월 비용 예상: Vercel Pro $20 + Blob $1 미만 + Neon $0 |

---

## 빠른 시작

요구사항: Node.js 22 이상

```bash
npm install
cp .env.example .env.local
npm run hash-password -- '로컬비밀번호1234'   # 출력값 → .env.local 의 ADMIN_PASSWORD_HASH
openssl rand -base64 32                        # 출력값 → .env.local 의 AUTH_SECRET
npm run dev
```

- 사이트: http://localhost:3000 / 관리자: http://localhost:3000/admin
- `npm run dev` 는 **로컬 DB 서버(PGlite) + Next 개발 서버**를 함께 띄웁니다.
  - 첫 실행 시 `.data/pglite` 에 테이블을 만들고 예시 데이터(공지 6 · 보도 5 · 앨범 10, 일부 앨범은 사진 2~4장)를 넣습니다.
  - 초기화하려면 서버를 끄고 `.data/` 폴더를 지우면 됩니다.
- `BLOB_READ_WRITE_TOKEN` 이 비어 있으면 업로드 이미지는 `.data/uploads` 에 저장되고 `/uploads/*` 로 서빙됩니다.
- 운영 DB(Neon)에 붙어서 개발하려면 `.env.local` 에 `DATABASE_URL` 을 넣고 `npm run dev:remote`.

---

## 폴더 구조

```
src/
├── app/
│   ├── (site)/                  공개 페이지 (헤더·푸터 포함)
│   │   ├── page.tsx             메인
│   │   ├── about/               인사말·연혁·조직·인증·오시는 길
│   │   ├── career/              진로·직업체험 — 전체(/career) · 분야별(/career/[theme])
│   │   ├── education/[slug]/    교육활동 5종 (content/programs.ts)
│   │   ├── experience/[slug]/   체험활동 4종
│   │   ├── community/[board]/   공지(notice)·보도(press) 목록 / page/[page] / [id]
│   │   ├── community/gallery/   포토갤러리 목록 / page/[page] / [id]
│   │   └── store/               상상마루샵 소개 + 네이버 스마트스토어 링크
│   ├── admin/
│   │   ├── login/               관리자 로그인
│   │   └── (panel)/             대시보드·게시글·갤러리 관리 (로그인 필요)
│   ├── api/admin/upload/        업로드 URL 발급 (+ local/ 로컬 업로드 수신)
│   ├── uploads/[...key]/        로컬 업로드 파일 서빙 (개발용)
│   ├── sitemap.ts · robots.ts · rss.xml/   SEO 파일 (자동 생성)
│   └── layout.tsx · globals.css · icon.png
├── actions/          Server Actions — admin.ts(관리자 쓰기), public.ts(조회수)
├── components/       layout/ home/ community/ admin/ ui/ ProgramPage.tsx
├── config/           site.ts(회사정보·SEO 기본값) · menu.ts(상단 메뉴)
├── content/          정적 콘텐츠 — programs.ts · career-programs.ts · about.ts · career.ts · photos.generated.ts(사진 목록, 자동 생성)
├── db/               schema.ts(Drizzle) · bootstrap.sql(테이블 DDL) · index.ts(연결)
├── lib/              data.ts(공개 조회·캐시) · admin-data.ts · auth.ts · session-token.ts
│                     storage.ts(Blob/로컬) · upload-client.ts · seo.tsx · html.ts · format.ts
└── proxy.ts          /admin 접근 1차 보호 (Next 16 의 middleware)
scripts/              local-db.mjs · db-init.mjs · hash-password.mjs · import-photos.mjs · extract-pdf-images.swift · fetch-pretendard.mjs
public/fonts/paperlogy/   Paperlogy 400~800 서브셋 (OFL, `npm run fetch-paperlogy`)
public/fonts/pretendard/  Pretendard Variable 동적 서브셋 (OFL, 폴백)
docs/DEPLOY.md        운영 배포 절차
old/                  기존 사이트 보관본
```

---

## 아키텍처

```
                  ┌──────────────────────── Vercel (Next.js) ────────────────────────┐
 방문자/검색봇 ──▶ │ 공개 페이지: 정적 HTML (빌드 시 생성 + 태그 기반 재생성)            │
                  │   └ src/lib/data.ts  ("use cache" + cacheTag("posts"|"gallery"))  │──▶ Neon Postgres
 관리자 ────────▶ │ /admin: 매 요청 서버 렌더링 (proxy.ts + requireAdmin)              │
                  │   └ src/actions/admin.ts (Server Actions) → updateTag() 로 즉시 반영│
                  │ /api/admin/upload → 저장 키 발급 + Blob 클라이언트 업로드 토큰      │
                  └──────────────────────────────────────────────────────────────────┘
 관리자 브라우저 ── (이미지 리사이즈 → WebP) ──직접 업로드──▶ Vercel Blob ──▶ 방문자
```

### 읽기 경로 (공개)
- 모든 공개 데이터 조회는 **`src/lib/data.ts`** 에만 있습니다. 함수마다 `"use cache"` + `cacheTag()` + `cacheLife()`.
- 그래서 공개 페이지는 정적 HTML 로 만들어지고, 검색봇이 JS 없이도 본문을 읽습니다.
- `cacheLife("hours")` 는 "N(새 글)" 배지 계산을 위한 주기 갱신용입니다.

### 쓰기 경로 (관리자)
- 모든 쓰기는 **`src/actions/admin.ts`** 의 Server Action. 첫 줄은 항상 `await requireAdmin()`.
- 저장 후 `updateTag("posts")` 또는 `updateTag("gallery")` → 관련 공개 페이지가 즉시 갱신됩니다.
- 게시글 HTML 은 저장 시 `sanitizePostHtml()` 로 정제(XSS 방지), 요약(excerpt)·대표 이미지(thumbnail) 자동 추출.

### 이미지 업로드
1. 관리자 브라우저가 이미지를 최대 2000px, WebP 로 줄임 (`src/lib/upload-client.ts`)
2. `POST /api/admin/upload` → 저장 키(`folder/YYYY/MM/uuid.ext`) 발급 (`src/lib/storage.ts`)
   - Blob 설정 시: `@vercel/blob/client` 의 `upload()` 가 같은 주소로 토큰을 요청 → `handleUpload` 가 키·형식·크기 검증 후 발급 → 브라우저가 Blob 에 직접 업로드 (Vercel 함수 본문 4.5MB 제한 우회)
   - 미설정 시: `/api/admin/upload/local` 로 PUT 해 `.data/uploads` 에 저장
3. 서버 액션은 `resolveUpload({ key, url })` 로 검증(우리 Blob 호스트 + 키와 같은 경로만) 후 `imageUrl`·`storageKey`(Blob URL) 저장
4. 글·사진 삭제 시 `deleteObject(storageKey)` 로 Blob 파일도 삭제, 글 수정 시 본문에서 빠진 이미지도 삭제

### 인증
- `ADMIN_ID` + `ADMIN_PASSWORD_HASH`(bcrypt, base64) 비교 → HS256 JWT 를 httpOnly 쿠키(`smaru_admin`, 7일)로 발급
- `src/proxy.ts` 가 `/admin/*` 1차 차단 + `X-Robots-Tag: noindex`
- 관리자 레이아웃·페이지·Server Action 모두 `requireAdmin()` 으로 재확인 (레이아웃과 페이지는 병렬 렌더링되므로 페이지에도 필요)
- 로그인 시도 제한: IP당 10분 5회 (메모리 기반 — [로드맵](#로드맵--남은-작업) 참고)

### SEO 구성
- 페이지별 `pageMetadata()` (`src/lib/seo.tsx`) → title · description · canonical · Open Graph · Twitter
- JSON-LD: EducationalOrganization · WebSite(메인), BreadcrumbList(서브), Course(프로그램), NewsArticle(게시글)
- `sitemap.xml`(정적 + DB 글/사진), `robots.txt`(`/admin`·`/api` 차단), `rss.xml`(네이버 RSS 제출용)
- `next.config.ts` 의 `htmlLimitedBots` 에 네이버 Yeti·다음·구글봇 등 → 봇은 스트리밍 없는 완성 HTML 수신
- 기존 사이트 주소(`/pages/**/*.html`) → 새 주소로 301 리디렉트
- 네이버·구글 소유확인 메타는 환경변수(`NAVER_SITE_VERIFICATION`, `GOOGLE_SITE_VERIFICATION`)

---

## DB 스키마

정의: `src/db/schema.ts` (Drizzle) — **`src/db/bootstrap.sql` 과 항상 함께 수정**

### `posts` — 공지사항·보도자료
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | serial PK | |
| board_type | varchar(20) | `notice` \| `press` |
| title | varchar(255) | |
| content | text | 정제된 HTML |
| excerpt | varchar(300) | 본문 요약 (meta description) |
| thumbnail_url | text null | 본문 첫 이미지 (OG 이미지) |
| views | int | 조회수 |
| is_published | bool | false 면 공개 페이지에서 숨김 |
| created_at / updated_at | timestamptz | |

### `gallery` — 포토갤러리
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | serial PK | |
| title | varchar(255) | 이미지 alt 로도 사용 (SEO) |
| description | varchar(500) | |
| image_url | text | Blob 공개 URL (로컬은 `/uploads/...`) |
| storage_key | text null | 삭제용 — Blob 이면 URL, 로컬이면 키 |
| width / height | int | |
| program_slug | varchar(80) null | 연결된 진로·직업체험 프로그램 (`career-programs.ts` 의 slug) — 강사 현장 사진 (v1.7) |
| created_at | timestamptz | |

`gallery` 한 행이 **앨범** 하나이고, 위 `image_url`·`storage_key`·`width/height` 가 **대표 사진**입니다(메인·목록·OG). 나머지 사진은 아래 테이블에 순서대로 들어갑니다.

### `gallery_images` — 앨범의 나머지 사진 (v1.4)
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | serial PK | |
| gallery_id | int FK → gallery.id | `ON DELETE CASCADE` |
| image_url / storage_key | text / text null | |
| width / height | int | |
| sort_order | int | 상세 페이지 표시 순서 (대표 사진 다음부터 0, 1, 2 …) |

운영 DB 반영: `npm run db:init` 다시 실행(멱등 — 기존 테이블은 그대로, `gallery_images` 만 생김). 기존 갤러리 행은 사진 1장짜리 앨범이 됩니다.

v1.7: `npm run db:init` 을 한 번 더 실행하면 `gallery.program_slug` 컬럼과 `gallery_program_idx` 인덱스가 추가됩니다(멱등). 로컬은 `npm run dev` 가 시작할 때 자동 반영합니다.

### 강사 현장 사진 (v1.7)
강사는 공유 관리자 계정으로 `/admin/gallery` 에서 새 앨범을 만들 때 **연결 프로그램**을 고릅니다. 그러면
- 진로·직업체험 분야 페이지(`/career/<분야>`)의 해당 프로그램 아래 **현장 사진**에 최신순으로 쌓이고(프로그램당 최근 12장, `FIELD_PHOTOS_PER_PROGRAM`)
- 커뮤니티 포토갤러리에도 같은 앨범이 올라가며 목록·상세에 프로그램 이름과 링크가 붙습니다.
- 앨범 사진 관리 화면(`/admin/gallery/[id]`)에서 연결을 바꾸거나 해제할 수 있습니다. 공유 계정이라 올린 사람은 기록되지 않습니다.

---

## 백엔드 작업 가이드

### 공개 데이터 조회 추가
`src/lib/data.ts` 에 함수를 추가합니다.

```ts
export async function getSomething(id: number) {
  "use cache";
  cacheLife("days");                 // 갱신 주기
  cacheTag("something", `something-${id}`); // 무효화용 태그
  const db = await getDb();
  // ... Date 는 toISOString() 으로 바꿔서 반환 (직렬화)
}
```
- 공개 페이지에서 DB를 직접 부르지 마세요. 캐시되지 않으면 정적 HTML 에서 빠져 SEO 에 불리합니다.

### 관리자 쓰기 기능 추가
`src/actions/admin.ts` 에 Server Action 을 추가합니다.

```ts
export async function saveSomething(input: {...}): Promise<ActionResult> {
  await requireAdmin();          // 반드시 첫 줄
  // 입력 검증 → DB 쓰기
  updateTag("something");        // 공개 캐시 즉시 무효화
  return { ok: true };
}
```
- 관리자 화면 조회는 `src/lib/admin-data.ts` (캐시 없음).
- 관리자 페이지 파일에는 `export const instant = false;` 와 `await requireAdmin()` 을 넣습니다.

### 새 테이블 추가
1. `src/db/schema.ts` 에 테이블 정의
2. `src/db/bootstrap.sql` 에 같은 DDL (`CREATE TABLE IF NOT EXISTS ...`)
3. 로컬: 서버 재시작 시 자동 적용 (`scripts/local-db.mjs`)
4. 운영: `DATABASE_URL=... npm run db:init` 또는 Neon SQL Editor 에서 실행
   - 기존 테이블 컬럼 변경은 `ALTER TABLE` 을 직접 작성하거나 `npx drizzle-kit generate` 로 마이그레이션 생성

### 새 공개 페이지 추가
- `src/app/(site)/...` 에 만들고, `export const metadata = pageMetadata({...})` 또는 `generateMetadata` 로 메타 지정
- 레이아웃은 `<SubPage path=... title=... description=...>` 로 감싸면 타이틀 영역·브레드크럼·좌측 메뉴·JSON-LD 가 자동
- 메뉴에 노출하려면 `src/config/menu.ts` 에 추가 (sitemap 에도 자동 포함)
- **동적 라우트(`[id]` 등) 규칙**
  - `params` 는 최상위에서 `await` 하고 `export const instant = false;` → 크롤러에 완성 HTML + 정확한 404
  - `generateStaticParams` 는 최소 1개를 반환해야 함 (Cache Components 제약). 데이터가 없으면 placeholder 반환 후 `notFound()`
  - 페이지네이션은 쿼리스트링이 아닌 경로로 (`/community/notice/page/2`)
- 새 페이지 후 확인: `curl -A "Yeti" http://localhost:3000/새경로` 로 본문·title·description 이 HTML 에 있는지

---

## 환경변수

`.env.example` 참고. 로컬은 `.env.local`(git 제외), 운영은 Vercel 프로젝트 설정.

| 이름 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | 운영 | `https://imaginemaru.kr` — canonical·sitemap·OG 기준 |
| `DATABASE_URL` (또는 `POSTGRES_URL`) | 운영 | Neon 연결 문자열 — Vercel Marketplace 통합이 자동 주입. 비우면 로컬 DB(`npm run dev`) 사용 |
| `BLOB_READ_WRITE_TOKEN` | 운영 | Vercel Blob 스토어 연결 시 자동 주입. 비우면 `.data/uploads` 로컬 저장 |
| `ADMIN_ID` | 필수 | 관리자 아이디 |
| `ADMIN_PASSWORD_HASH` | 필수 | `npm run hash-password -- '비번'` 출력값 |
| `AUTH_SECRET` | 필수 | 32자 이상 임의 문자열 |
| `NAVER_SITE_VERIFICATION` | 선택 | 네이버 서치어드바이저 HTML 태그 content 값 |
| `GOOGLE_SITE_VERIFICATION` | 선택 | 구글 서치콘솔 HTML 태그 content 값 |
| `LOCAL_DB_URL` | 자동 | `npm run dev` 가 설정 — 직접 넣지 마세요 |

---

## 명령어

| 명령 | 설명 |
|---|---|
| `npm run dev` | 로컬 DB + 개발 서버 |
| `npm run dev:remote` | `.env.local` 의 `DATABASE_URL`(Neon)로 개발 서버 |
| `npm run db:local` | 로컬 DB 서버만 실행 |
| `npm run build` / `npm start` | 운영 빌드 / 실행 (DB 없이도 빌드 가능 — 빈 데이터로 생성) |
| `npm run lint` / `npm run typecheck` | 코드 검사 |
| `npm run db:init` | 운영 DB 에 테이블 생성 (`DATABASE_URL` 필요, 여러 번 실행해도 안전) |
| `npm run hash-password -- '비번'` | 관리자 비밀번호 해시 생성 |
| `npm run import-photos -- --ppt <폴더> --pdf <폴더>` | PPT·PDF 원본 이미지 → `public/photos/*.webp` 변환 (아래 참고) |

로컬 DB 로 운영 빌드 확인: `node scripts/local-db.mjs --run next build` → `node scripts/local-db.mjs --run next start`

---

## 콘텐츠 수정 위치

회사 정보의 출처는 **[유한회사 상상마루] 2024 기업소개 PDF/PPT**, 진로·직업체험 프로그램은 **2026년 진로·진학·직업체험(특강) 프로그램 운영 계획(안)·요약 PDF** 입니다 (저장소 루트에 두되 git 제외). `old/` 의 예전 문구는 실제 정보가 아니므로 참고하지 마세요.

| 바꿀 것 | 파일 |
|---|---|
| 상단 메뉴 구성 | `src/config/menu.ts` |
| 회사 정보·연락처·주소·인증 목록·스토어 주소·SEO 기본 문구 | `src/config/site.ts` |
| 교육활동 5종·체험활동 3종 (표·사진·섹션 포함, 메인 카드의 대상·운영 `card`) | `src/content/programs.ts` |
| 진로·직업체험 9개 분야·82개 프로그램(내용·운영 형태·대표 분야) — 메뉴·메인 카드·사이트맵에 자동 반영 | `src/content/career-programs.ts` |
| 인사말·연혁·조직도·MOU·교통안내·협력기관 로고 | `src/content/about.ts` |
| 진로체험기관 인증 목록 | `src/content/career.ts` |
| 메인 히어로(사진 3장·캡션)·바로가기·섹션 문구 | `src/components/home/*` (`Hero.tsx`, `QuickLinks.tsx` …) |
| 색상·라운드·폰트·버튼·타입 스케일 | `src/app/globals.css` 의 `@theme` 와 `@utility` (규칙은 아래 디자인 절) |
| 공지·보도자료·포토갤러리 | 관리자 페이지 `/admin` |

### 사진 교체·추가
사진은 PPT·PDF 원본에서 추출해 `public/photos/*.webp` 로 변환했고, 코드는 `photos["이름"]` 으로 참조합니다(타입 체크됨). 변환 결과는 커밋되어 있으니 사진을 바꿀 때만 아래를 실행합니다.
1. PPT 이미지 꺼내기: `unzip -o -q "[유한회사 상상마루] 2024_기업소개_PPT_New.pptx" "ppt/media/*" -d /tmp/smaru-ppt`
2. PDF 이미지 꺼내기 (macOS 전용, Xcode 명령줄 도구의 swift 사용):
   `swift scripts/extract-pdf-images.swift "<운영계획(안).pdf>" /tmp/smaru-pdf/plan` · `swift scripts/extract-pdf-images.swift "<요약.pdf>" /tmp/smaru-pdf/summary`
   — 파일 이름은 `pNN-iMM`(쪽 · 위→아래 순서), `manifest.json` 에 페이지 위치가 함께 기록됩니다.
3. `scripts/import-photos.mjs` 에 추가: 회사 사진은 `pptMap` 에 `"새이름": ["imageNN.jpg", 최대px]`, 진로·직업체험 사진은 `pdfMap` 에 `"<프로그램 slug>": ["plan/p13-i02", …]`(첫 장 = 대표 `cp-<slug>`, 나머지 `cp-<slug>-2` …)
4. `npm run import-photos -- --ppt /tmp/smaru-ppt/ppt/media --pdf /tmp/smaru-pdf` → `public/photos/` 와 `src/content/photos.generated.ts` 갱신
5. 콘텐츠 파일에서 `image: "새이름"` 또는 `photos: [{ name: "새이름", alt: "..." }]` 로 사용 (진로·직업체험 `cp-*` 사진은 `programPhotos()` 가 자동으로 찾음)

새 원본 사진(PPT 밖)은 같은 폴더에 넣고 2~3 단계를 따르면 됩니다. 활동 사진이 계속 쌓이는 경우는 관리자 포토갤러리를 쓰세요.

## 로드맵 / 남은 작업

### 운영 연결 (다음 단계)
- [ ] 클라이언트 명의 Vercel 팀(Pro) 생성 → 프로젝트 Import → Storage 에서 Neon(Vercel-managed)·Blob 연결 → `npm run db:init` — **neon-http 연결·Blob 클라이언트 업로드는 실제 Vercel 환경에서 아직 검증 안 됨** (로컬 저장소 경로만 검증)
- [ ] 도메인(imaginemaru.kr) 연결
- [ ] 네이버 서치어드바이저 / 구글 서치콘솔 등록, sitemap·RSS 제출
- [ ] 미리넷 DB·관리자 비밀번호 교체 (예전 커밋 기록에 남아 있음) 후 호스팅 해지
- 절차: [docs/DEPLOY.md](docs/DEPLOY.md)

### 콘텐츠 (클라이언트 확인 필요)
- [ ] **우편번호**: 동서로49길 24-1 우편번호 미확인 → `site.ts` 의 `postalCode` (비어 있으면 JSON-LD 에서 제외)
- [ ] **교통편**: 영등동 기준 버스 노선·주차 정보 → `about.ts` 의 `transport`
- [ ] **스마트스토어 주소**: `https://smartstore.naver.com/sangnarae` (PDF 캡처 기준, 접속 확인 못 함) → `site.ts` 의 `store.url`
- [ ] **MOU 8건 중 판독 못 한 4건** 기관명 → `about.ts` 의 `mous`
- [ ] 오시는 길 지도: 네이버 지도 퍼가기 iframe 삽입 (`src/app/(site)/about/location/page.tsx`)
- [ ] PPT 사진 중 화질 낮은 것(800px 안팎) 원본 확보 시 교체
- [ ] 상단 메뉴 변경 시 `menu.ts` 반영
- [ ] 게시판·갤러리 검색 (v1.4 표 레이아웃에 검색창 자리만 비워 둠 — 레퍼런스 isedu.kr 은 제목 검색 제공)

### 백엔드 개선 후보
- [ ] **프로그램 신청/문의 폼** — 현재 각 프로그램의 "신청 문의" 는 전화·메일 링크. DB 저장 + 관리자 목록 + 이메일 알림(예: Resend) 추가 후보
- [ ] **로그인 시도 제한 강화** — 지금은 서버 메모리 기반이라 서버리스 인스턴스마다 따로 셈. Upstash Redis 등으로 이전
- [ ] 관리자 비밀번호 변경 UI (현재는 환경변수 교체 후 재배포), 필요 시 다중 관리자(`admins` 테이블)
- [ ] 게시글 첨부파일(PDF·HWP) 업로드
- [ ] 메인 팝업 공지 (참고 사이트에 있음)
- [ ] 스토어 기능 (현재 "준비 중" 페이지)
- [ ] 저장소 고아 이미지 정리 배치 (에디터에 올렸다가 저장 안 한 이미지)
- [ ] 조회수: 현재 세션당 1회 증가, 봇 제외 처리 없음
- [ ] DB 백업 정책 (Neon 무료 플랜 복구 기간 확인)

### 성능 (Lighthouse, 모바일 시뮬레이션 기준)
- SEO 100 · 접근성 100 · 권장사항 100 · 성능 77~87 (v1.2, 로컬 측정)
- 성능 감점 원인: 메인 히어로 사진(LCP, v1.3 부터 첫 장 1장만 미리 불러옴)과 한글 웹폰트. 고화질 원본 확보 시 히어로 사진 용량 재조정 필요

---

## 디자인 규칙 (v1.5)

화이트 + 키위 그린 — 흰 바탕에 로고 라임을 글자용으로 한 단계 진하게 한 초록이 주색, 노랑은 형광펜 밑줄, 산호는 NEW·강조로만 씁니다.
레이아웃·색 구조(흰 바탕, 연회색 표 머리·소식 띠, 틴트 그라데이션 타이틀 띠, 주색 그라데이션 사이드메뉴 블록)는 isedu.kr(익산시 교육공동체지원센터)을 참고했습니다. 글꼴은 **Paperlogy**(본문 500 · 강조 600 · 제목 700).

| 토큰 | 값 | 용도 |
|---|---|---|
| `paper` / `cream` | #FFFFFF / #F5F6F4 | 기본 바탕 / 교차 띠·표 머리·hover (연회색) |
| `ink` / `body` / `muted` | #1F1E1C / #474E58 / #6B6B6B | 제목·푸터 바탕 / 본문 / 보조 |
| `line` / `line-strong` | #E5E5E5 / #CFCFCF | 가는 선 / 테두리 |
| `green` / `green-dark` | #357F20 / #2A6A19 | 링크·활성·주 버튼·섹션 번호 (흰 바탕 5.0:1) / hover |
| `teal` | #27825F | 키위 그라데이션 끝 |
| `grad-kiwi` | #55A633 → #27825F (135deg) | 서브페이지 사이드메뉴 섹션 블록 (흰 24px 굵은 글자 ≥3:1) |
| `grad-band` | #EEF7E6 → #E8F3EE | 서브 타이틀 띠 · 메인 히어로 왼쪽 패널 |
| `hl` (노랑) | #F5B800 55% | 제목 속 핵심 단어 형광펜 |
| `red` | #C23A45 | NEW 표시·에러 |

- 버튼은 `btn btn-primary|btn-outline|btn-ghost` (모서리 8px, 17px · 높이 52px / `btn-sm` 15px), 섹션 머리는 `SectionHead` (초록 띠 위에서는 `tone="dark"`, 캐러셀 화살표는 `actions` 슬롯)
- 폭: `container-site` 는 창 폭을 따라 넓어짐(최대 1680px, 좌우 여백 `clamp(20px, 5.2vw, 80px)` — 1440px 에서 75px). 서브페이지 제목 띠·본문은 `container-read`(최대 1320px)로 읽기 폭 유지
- 헤더: 높이 85px(CSS 변수 `--header-h` — sticky 위치도 이 값 사용), 로고 46px, 1차 메뉴 칸 폭 `clamp(104px, 10.4vw, 150px)`·글자 가운데. 주 메뉴에 마우스·포커스가 들어오면 모든 하위 메뉴가 각 칸 아래로 한꺼번에 펼쳐지는 메가메뉴(`MainNav.tsx`, 여닫기는 JS 상태 — 나갈 때 150ms 지연). 1024~1439px 에서 문의 버튼은 아이콘만
- 메인 첫 화면: 한 겹 히어로(왼쪽 크림 글 / 오른쪽 사진 1장이 7초마다 교차 페이드, 오른쪽 아래 고정 위치의 사진 고르기 막대·일시정지 버튼) + 바로가기 4칸. 사진 위 글자는 작은 캡션 라벨뿐
- 02 프로그램: 일러스트 드론축구장 띠(`turf` 체크무늬 잔디 + 풀잎 · 그물 펜스 · 경기장 선 · 링 골대 · 나는 드론축구공 `ui/DroneBall`, 모바일은 잔디·풀잎만) 위 흰 카드 슬라이더(사진 3:2, 분류 라벨, 대상·운영 2줄, 키워드 태그 2개). 끊김 없이 계속 흐름(초당 약 36px, 무한 루프, 마우스를 올리면 멈추고 떼면 바로 다시 흐름, 일시정지 버튼 — `embla-carousel-auto-scroll`), 아래 흰 막대를 누르거나 좌우로 끌어 이동(현재 위치는 굴러가는 드론축구공 손잡이, 마우스를 올리면 공 양옆 ‹ › · 칸 눈금 · 프로그램 이름)
- 서브페이지 틀(`SubPage`): 크림 타이틀 띠(최소 220px) 가운데에 제목 + `홈 › 섹션 › 페이지` 브레드크럼, 왼쪽에 띠 위로 떠 있는 메뉴 카드(초록 섹션명 블록 + 흰 메뉴 카드, 항목 오른쪽 `›` 사각, 활성은 초록). 상세 글은 `bandTitle` 로 띠에 게시판 이름을 두고 글 제목은 본문 `DetailHead` 의 h1
- 메인 04 소식: 공지사항 | 포토갤러리 2단(공지 첫 글 날짜 상자 + 점 목록 / 사진 카드 2장 캐러셀, 열 머리 `‹ ›` `+`). 보도자료는 메인에 없음(메뉴로만)
- 글자: 공개 사이트 보조 글자 최소 13px, 누르는 것(메뉴·버튼·링크·표·페이지 번호) 16~18px
- 커뮤니티: 공지·보도는 표(번호 · 제목 · 작성일 · 조회, 위 `border-ink` 2px · 머리행 크림), 포토갤러리는 3열 카드(사진 3:2 · 제목 2줄 · `등록일 | 날짜`, 여러 장이면 `N장` 라벨), 상세는 제목+메타 → 본문/사진 세로 나열 → 먹색 `목록` 버튼 → `이전글 | 다음글` 2칸 바(`PrevNext`), 페이지네이션은 `« ‹ 1 2 › »` 사각 버튼
- 쓰지 않는 것: 알약 모양(`rounded-full`) 칩·버튼, `grad-kiwi`·`grad-band` 외 그라데이션, 대문자 영문 소제목, 제목 옆 세로 막대, 카드 기본 그림자(서브페이지 메뉴 카드만 예외), 사진 위 글자 오버레이(캡션 라벨 제외). 서브페이지 섹션명 블록·메뉴 카드의 비대칭 큰 모서리(44px·32px)는 예외로 허용
- hover 떠오름: 메인 사진 카드(프로그램·진로체험·소식 섹션 포토갤러리)만 마우스를 올리면 6px 위로 + 옅은 그림자(`shadow-lift`). '동작 줄이기' 설정이면 움직이지 않음
- 명도 대비는 흰 바탕 기준 글자 4.5:1 이상, `grad-kiwi` 위 큰 흰 글자 3:1 이상으로 맞춰 두었습니다(라임 원색 #7ABD47 은 2.3:1 이라 글자 뒤에 못 씀). 새 색을 넣을 때도 확인하세요.

## 주의사항

- **Next.js 16 은 이전 버전과 다릅니다.** 코드 작성 전 `node_modules/next/dist/docs/` 를 확인하세요 ([AGENTS.md](AGENTS.md)).
  - middleware → `src/proxy.ts`
  - `revalidate`/`dynamic` 대신 `"use cache"`, `cacheLife`, `cacheTag`, `updateTag`
  - `dynamicParams` 사용 불가, `instant` 옵션 존재
- **PGlite 파일을 앱에서 직접 열지 마세요.** Next 개발 서버는 여러 워커 프로세스를 쓰기 때문에 동시에 열면 DB가 손상됩니다. 로컬 DB는 `scripts/local-db.mjs` 한 프로세스가 소유하고 HTTP 로 쿼리를 받습니다 (`drizzle-orm/pg-proxy`).
- bcrypt 해시는 `$` 를 포함해 `.env` 파일에서 깨지므로 `hash-password` 스크립트는 base64 로 출력합니다.
- 관리자 화면 외에는 `cookies()`/`headers()` 를 쓰지 마세요. 공개 페이지가 동적 렌더링으로 바뀌어 정적 HTML 이점이 사라집니다.
- 공개 페이지 루트 레이아웃에 `canonical` 을 두지 마세요 (모든 하위 페이지가 홈을 canonical 로 가리키게 됨). 페이지별 `pageMetadata()` 사용.
