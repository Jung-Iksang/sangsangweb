# 상상마루 홈페이지

유한회사 상상마루(전북 익산 진로·직업체험 교육 기관) 공식 홈페이지입니다.
기존 정적 HTML + PHP(미리넷 호스팅) 사이트를 **Next.js 16 + Vercel + Neon Postgres + AWS S3/CloudFront** 로 새로 만들었습니다.

> **현재 버전: v1.2 — 디자인 리파인 (웜 크림 에디토리얼 · Pretendard)**
> 회사 정보·사진은 기업소개 PDF/PPT 기준(v1.1), 디자인은 크림 바탕·로고 초록 주색·번호 매긴 섹션으로 정리했습니다. 운영 인프라(Neon·S3·Vercel) 연결은 아직입니다.
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
| 스타일 | Tailwind CSS 4 + 디자인 토큰(`src/app/globals.css`) | 폰트 Pretendard Variable 동적 서브셋 자체 호스팅 |
| DB | Postgres — 운영 Neon / 로컬 PGlite | ORM: Drizzle |
| 이미지 | AWS S3 + CloudFront — 로컬은 `.data/uploads` | 브라우저 → S3 직접 업로드(presigned URL) |
| 인증 | 단일 관리자, 환경변수 + JWT 쿠키(jose) | 일반 회원 기능 없음 |
| 에디터 | Tiptap 3 | 게시글 본문 |
| 호스팅 | Vercel | 월 비용 예상: Vercel Pro $20 + S3 $1~3 + Neon $0 |

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
  - 첫 실행 시 `.data/pglite` 에 테이블을 만들고 예시 데이터(공지 6 · 보도 5 · 사진 10)를 넣습니다.
  - 초기화하려면 서버를 끄고 `.data/` 폴더를 지우면 됩니다.
- S3 환경변수가 비어 있으면 업로드 이미지는 `.data/uploads` 에 저장되고 `/uploads/*` 로 서빙됩니다.
- 운영 DB(Neon)에 붙어서 개발하려면 `.env.local` 에 `DATABASE_URL` 을 넣고 `npm run dev:remote`.

---

## 폴더 구조

```
src/
├── app/
│   ├── (site)/                  공개 페이지 (헤더·푸터 포함)
│   │   ├── page.tsx             메인
│   │   ├── about/               인사말·연혁·조직·인증·오시는 길
│   │   ├── career/              진로·직업체험 (교육기부 진로체험 인증기관)
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
├── content/          정적 콘텐츠 — programs.ts · about.ts · career.ts · photos.generated.ts(사진 목록, 자동 생성)
├── db/               schema.ts(Drizzle) · bootstrap.sql(테이블 DDL) · index.ts(연결)
├── lib/              data.ts(공개 조회·캐시) · admin-data.ts · auth.ts · session-token.ts
│                     storage.ts(S3/로컬) · upload-client.ts · seo.tsx · html.ts · format.ts
└── proxy.ts          /admin 접근 1차 보호 (Next 16 의 middleware)
scripts/              local-db.mjs · db-init.mjs · hash-password.mjs · import-photos.mjs · fetch-pretendard.mjs
public/fonts/pretendard/  Pretendard Variable 동적 서브셋 (OFL)
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
                  │ /api/admin/upload → S3 presigned PUT URL 발급                      │
                  └──────────────────────────────────────────────────────────────────┘
 관리자 브라우저 ── (이미지 리사이즈 → WebP) ──PUT──▶ S3 ──▶ CloudFront ──▶ 방문자
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
2. `POST /api/admin/upload` → 업로드 대상 URL 발급 (`src/lib/storage.ts`)
   - S3 설정 시: presigned PUT URL (5분 유효), 공개 URL 은 CloudFront 도메인
   - 미설정 시: `/api/admin/upload/local` 로 받아 `.data/uploads` 에 저장
3. 브라우저가 해당 URL 로 직접 PUT → Vercel 함수 용량 제한(4.5MB)을 우회
4. 글·사진 삭제 시 저장소 파일도 삭제, 글 수정 시 본문에서 빠진 이미지도 삭제

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
| image_url | text | CloudFront URL (로컬은 `/uploads/...`) |
| storage_key | text null | 저장소 키 (삭제 시 사용) |
| width / height | int | |
| created_at | timestamptz | |

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
| `DATABASE_URL` | 운영 | Neon 연결 문자열. 비우면 로컬 DB(`npm run dev`) 사용 |
| `AWS_REGION` | 운영 | `ap-northeast-2` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | 운영 | S3 PutObject/DeleteObject 권한만 가진 IAM 키 |
| `S3_BUCKET` | 운영 | 버킷 이름 |
| `NEXT_PUBLIC_CDN_DOMAIN` | 운영 | CloudFront 도메인 (`https://` 제외) |
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
| `npm run import-photos -- <폴더>` | PPT 원본 이미지 → `public/photos/*.webp` 변환 (아래 참고) |

로컬 DB 로 운영 빌드 확인: `node scripts/local-db.mjs --run next build` → `node scripts/local-db.mjs --run next start`

---

## 콘텐츠 수정 위치

회사 정보의 출처는 **[유한회사 상상마루] 2024 기업소개 PDF/PPT** 입니다 (저장소 루트에 두되 git 제외). `old/` 의 예전 문구는 실제 정보가 아니므로 참고하지 마세요.

| 바꿀 것 | 파일 |
|---|---|
| 상단 메뉴 구성 | `src/config/menu.ts` |
| 회사 정보·연락처·주소·인증 목록·스토어 주소·SEO 기본 문구 | `src/config/site.ts` |
| 교육활동 5종·체험활동 4종 (표·사진·섹션 포함) | `src/content/programs.ts` |
| 인사말·연혁·조직도·MOU·교통안내·협력기관 로고 | `src/content/about.ts` |
| 진로체험 6개 스쿨·인증·사진 카드 | `src/content/career.ts` |
| 메인 히어로·섹션 문구 | `src/components/home/*` |
| 색상·라운드·폰트·버튼·타입 스케일 | `src/app/globals.css` 의 `@theme` 와 `@utility` (규칙은 아래 디자인 절) |
| 공지·보도자료·포토갤러리 | 관리자 페이지 `/admin` |

### 사진 교체·추가
사진은 PPT 원본에서 추출해 `public/photos/*.webp` 로 변환했고, 코드는 `photos["이름"]` 으로 참조합니다(타입 체크됨).
1. PPT 이미지 꺼내기: `unzip -o -q "[유한회사 상상마루] 2024_기업소개_PPT_New.pptx" "ppt/media/*" -d /tmp/smaru-ppt`
2. `scripts/import-photos.mjs` 의 `map` 에 `"새이름": ["imageNN.jpg", 최대px]` 추가
3. `npm run import-photos -- /tmp/smaru-ppt/ppt/media` → `public/photos/` 와 `src/content/photos.generated.ts` 갱신
4. 콘텐츠 파일에서 `image: "새이름"` 또는 `photos: [{ name: "새이름", alt: "..." }]` 로 사용

새 원본 사진(PPT 밖)은 같은 폴더에 넣고 2~3 단계를 따르면 됩니다. 활동 사진이 계속 쌓이는 경우는 관리자 포토갤러리를 쓰세요.

## 로드맵 / 남은 작업

### 운영 연결 (다음 단계)
- [ ] Neon 프로젝트 생성 → `npm run db:init` — **neon-http 연결은 실제 Neon 으로 아직 검증 안 됨**
- [ ] S3 버킷·CORS·CloudFront·IAM 설정 — **presigned 업로드는 실제 S3 로 아직 검증 안 됨** (로컬 저장소 경로만 검증)
- [ ] Vercel 배포 · 환경변수 · Pro 플랜 · 도메인(imaginemaru.kr) 연결
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
- 성능 감점 원인: 메인 히어로 사진 2장(LCP)과 한글 웹폰트. 고화질 원본 확보 시 히어로 사진 용량 재조정 필요

---

## 디자인 규칙 (v1.2)

웜 크림 에디토리얼 — 기업소개 PPT 표지의 크림색 바탕, 로고의 초록을 주색으로, 노랑은 형광펜 밑줄로만 씁니다.

| 토큰 | 값 | 용도 |
|---|---|---|
| `paper` / `cream` | #FBFAF7 / #F6F3EC | 기본 바탕 / 교차 띠·상단 타이틀 |
| `ink` / `body` / `muted` | #1F1E1C / #44423D / #6F6B63 | 제목·푸터 바탕 / 본문 / 보조 |
| `line` / `line-strong` | #E3DED3 / #CFC9BC | 가는 선 / 테두리 |
| `green` | #2F6B23 | 링크·활성·주 버튼·섹션 번호 |
| `hl` (노랑) | #F5B800 55% | 제목 속 핵심 단어 형광펜 |
| `red` | #B8323D | NEW 표시·에러 |

- 버튼은 `btn btn-primary|btn-outline|btn-ghost` (모서리 8px), 섹션 머리는 `SectionHead`
- 쓰지 않는 것: 알약 모양(`rounded-full`) 칩·버튼, 그라데이션 박스, 대문자 영문 소제목, 제목 옆 세로 막대, 카드 그림자, 사진 위 글자 오버레이 (예외: 메인 첫 화면 분할 사진 패널의 하단 스크림)
- 명도 대비는 크림 바탕 기준 모두 4.5:1 이상으로 맞춰 두었습니다. 새 색을 넣을 때도 확인하세요.

## 주의사항

- **Next.js 16 은 이전 버전과 다릅니다.** 코드 작성 전 `node_modules/next/dist/docs/` 를 확인하세요 ([AGENTS.md](AGENTS.md)).
  - middleware → `src/proxy.ts`
  - `revalidate`/`dynamic` 대신 `"use cache"`, `cacheLife`, `cacheTag`, `updateTag`
  - `dynamicParams` 사용 불가, `instant` 옵션 존재
- **PGlite 파일을 앱에서 직접 열지 마세요.** Next 개발 서버는 여러 워커 프로세스를 쓰기 때문에 동시에 열면 DB가 손상됩니다. 로컬 DB는 `scripts/local-db.mjs` 한 프로세스가 소유하고 HTTP 로 쿼리를 받습니다 (`drizzle-orm/pg-proxy`).
- bcrypt 해시는 `$` 를 포함해 `.env` 파일에서 깨지므로 `hash-password` 스크립트는 base64 로 출력합니다.
- 관리자 화면 외에는 `cookies()`/`headers()` 를 쓰지 마세요. 공개 페이지가 동적 렌더링으로 바뀌어 정적 HTML 이점이 사라집니다.
- 공개 페이지 루트 레이아웃에 `canonical` 을 두지 마세요 (모든 하위 페이지가 홈을 canonical 로 가리키게 됨). 페이지별 `pageMetadata()` 사용.
