# 배포 가이드 (Vercel 하나로 — 호스팅 + Neon DB + Blob 사진 저장소)

상상마루 홈페이지를 운영 환경에 올리는 순서입니다. 처음 한 번만 하면 되고, 이후에는 `main` 브랜치에 push 하면 Vercel 이 자동 배포합니다.
**가입·결제는 Vercel 한 곳**입니다. DB(Neon)와 사진 저장소(Blob)는 Vercel 안에서 만들고 Vercel 청구서에 합산됩니다.

| 구성 | 역할 | 예상 비용(월) |
|---|---|---|
| Vercel Pro | Next.js 호스팅 · 도메인 · HTTPS · CDN | $20 (팀 멤버 1명당. Hobby 무료 플랜은 상업용 사용 불가) |
| Neon (Vercel Marketplace, Free) | Postgres DB — 게시글·갤러리 정보 | $0 (0.5GB까지. 5분 유휴 후 잠들어 관리자 첫 진입만 1초쯤 늦음) |
| Vercel Blob | 업로드 사진 저장·전송 | $1 안쪽 (저장 GB당 $0.023, 전송 GB당 $0.05) |

> 사이트가 여러 개(상상마루 외 2개)라도 **같은 팀에 프로젝트만 추가**하면 됩니다. 추가 요금 없음. 사이트마다 DB·Blob 스토어는 따로 만드세요.
> 결제는 해외 카드 결제라 **세금계산서는 발행되지 않고** 인보이스(영수증)만 받을 수 있습니다.

---

## 0. GitHub 저장소 (클라이언트 명의)

배포 기준 저장소는 클라이언트 계정의 **`chojinuk/sangsangmaru`**(비공개)입니다. 개발사 계정은 collaborator 로 초대되어 있습니다(완료).
저장소 주인(클라이언트)이 한 번 해 줄 것:

1. 저장소 → **Settings → Branches → Add branch ruleset**(또는 Branch protection rule) → 대상 `main`
2. **Require a pull request before merging** 켜기 (승인 수는 0 이어도 됨 — 직접 push 만 막는 용도)
3. **Block force pushes** 켜기

> collaborator 권한으로는 이 설정을 바꿀 수 없어 저장소 주인이 해야 합니다. 브랜치 사용 규칙은 README 의 "브랜치 · 배포 규칙" 절.

## 1. Vercel 팀 만들기 (클라이언트 명의)

1. https://vercel.com 가입 (GitHub 계정 연결 권장) → **Create Team** → 팀 이름 예: `sangsangmaru`
2. Settings → **Billing** → **Pro** 로 전환, 사업자 카드 등록
3. Settings → **Members** → 개발사 계정 초대 (Member 권한)

## 2. 프로젝트 만들기

1. 팀 대시보드 → **Add New → Project** → GitHub 저장소 `chojinuk/sangsangmaru` Import (Framework: Next.js 자동 인식). GitHub 연결은 **클라이언트 GitHub 계정**으로 (Vercel GitHub App 에 이 저장소 접근 허용)
   — Production Branch 는 `main`(기본값). 그 밖의 브랜치·PR 은 자동으로 Preview 배포
2. 일단 **Deploy** — 환경변수가 없어서 DB 없는 상태로 빌드만 되고, 아래 3~4 를 마친 뒤 Redeploy 합니다.

## 3. DB · 사진 저장소 연결 (프로젝트 → Storage 탭)

1. **Create Database → Neon (Postgres)** → **Vercel-managed** 선택(Neon 가입 없이 Vercel 이 계정을 만들어 주고 결제 합산) → Region `Singapore (ap-southeast-1)` 또는 가장 가까운 곳 → Free 플랜 → 프로젝트에 Connect
   - `DATABASE_URL`·`POSTGRES_URL` 등이 자동으로 환경변수에 들어갑니다(코드는 둘 다 인식).
2. **Create → Blob** → 스토어 이름 예: `sangsangmaru-images` → 프로젝트에 Connect
   - `BLOB_READ_WRITE_TOKEN` 이 자동으로 들어갑니다.

## 4. 나머지 환경변수 (Settings → Environment Variables, Production · Preview 모두)

로컬에서 먼저 값을 만듭니다.

```bash
npm run hash-password -- '관리자비밀번호(10자 이상)'   # → ADMIN_PASSWORD_HASH 값
openssl rand -base64 32                                # → AUTH_SECRET 값
```

| 이름 | 값 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://imaginemaru.kr` |
| `ADMIN_ID` | 관리자 아이디 |
| `ADMIN_PASSWORD_HASH` | 위에서 만든 값 |
| `AUTH_SECRET` | 위에서 만든 값 |
| `NAVER_SITE_VERIFICATION` | (7 에서 받은 값, 나중에 추가 가능) |
| `GOOGLE_SITE_VERIFICATION` | (7 에서 받은 값, 나중에 추가 가능) |

## 5. 테이블 만들기 (한 번만, 여러 번 실행해도 안전)

Storage → Neon → `.env.local` 탭에서 `DATABASE_URL` 값을 복사한 뒤 로컬에서:

```bash
DATABASE_URL='복사한주소' npm run db:init
```

(또는 Neon 콘솔 SQL Editor 에 `src/db/bootstrap.sql` 내용을 붙여넣고 실행)

그다음 Deployments → 최신 배포 → **Redeploy** → `*.vercel.app` 주소에서 `/admin` 로그인·글 작성·사진 업로드가 되는지 확인합니다.

> v1.7 이상으로 업데이트할 때는 `npm run db:init` 을 한 번 더 실행하세요(멱등). 강사 현장 사진용 `gallery.program_slug` 컬럼이 추가됩니다. 실행 전 배포하면 포토갤러리·진로·직업체험 분야 페이지가 오류를 냅니다.

> `NEXT_PUBLIC_*` 값이나 검증 코드를 바꾼 뒤에는 **Redeploy** 해야 반영됩니다.

## 6. 도메인 연결 (imaginemaru.kr)

1. 프로젝트 → **Settings → Domains** → `imaginemaru.kr`, `www.imaginemaru.kr` 추가 (www → apex 리디렉트 권장)
2. 도메인 등록처(가비아/후이즈 등) DNS 관리에서 Vercel 이 안내하는 레코드 입력
   - `@` → A 레코드 (Vercel 안내 IP)
   - `www` → CNAME `cname.vercel-dns.com`
3. HTTPS 인증서는 자동 발급
4. 새 사이트 정상 동작 확인 후 미리넷 호스팅 해지 (기존 주소 `/pages/*.html` 는 새 주소로 301 리디렉트되도록 설정되어 있음)

## 7. 검색엔진 등록 (가장 중요)

### 네이버 서치어드바이저 — https://searchadvisor.naver.com
1. 웹마스터 도구 → 사이트 등록 → `https://imaginemaru.kr`
2. 소유 확인 → **HTML 태그** 선택 → `content="..."` 값만 복사 → Vercel `NAVER_SITE_VERIFICATION` 에 입력 → Redeploy → 확인 클릭
3. 요청 → **사이트맵 제출**: `https://imaginemaru.kr/sitemap.xml`
4. 요청 → **RSS 제출**: `https://imaginemaru.kr/rss.xml`
5. 검증 → **웹 페이지 수집** 으로 주요 페이지 수집 요청, **robots.txt** 검증

### 구글 서치콘솔 — https://search.google.com/search-console
1. 속성 추가 → **URL 접두어** `https://imaginemaru.kr`
2. **HTML 태그** 방식 → `content` 값 → `GOOGLE_SITE_VERIFICATION` → Redeploy → 확인
   (또는 DNS TXT 방식으로 도메인 속성 등록)
3. Sitemaps → `sitemap.xml` 제출
4. URL 검사 → 홈 · 주요 프로그램 페이지 **색인 생성 요청**

### 다음(카카오) — https://register.search.daum.net
- 사이트 등록 신청 (URL만 입력)

## 8. 배포 후 점검 체크리스트

- [ ] `https://imaginemaru.kr/robots.txt` 에 `Disallow: /admin`, Sitemap 주소 표시
- [ ] `https://imaginemaru.kr/sitemap.xml`, `/rss.xml` 정상
- [ ] 페이지 소스 보기에서 `<title>`, `description`, `og:image`, `canonical`, `naver-site-verification` 확인
- [ ] `/admin` 로그인 → 글 작성(이미지 포함) → 홈·목록·상세에 즉시 반영
- [ ] 갤러리 앨범 업로드 → 이미지 주소가 `*.public.blob.vercel-storage.com` 인지 확인 → 앨범 삭제 시 Storage → Blob 에서 파일도 사라지는지 확인
- [ ] 카카오톡/페이스북에 주소 공유 시 미리보기 이미지 표시
- [ ] 옛 주소(예: `/pages/about/history.html`)가 새 주소로 301 이동

## 나중에 생각할 것

- **Neon 잠듦이 거슬리면**: Storage → Neon → 플랜을 Launch(월 $19) 로 올리면 항상 깨어 있음
- **사진이 많이 쌓이면**: Blob 사용량은 Vercel 대시보드 Usage 에서 확인. 1만 장(약 5GB)이어도 월 $1 미만
