# 배포 가이드 (Vercel + Neon + AWS S3/CloudFront)

상상마루 홈페이지를 운영 환경에 올리는 순서입니다. 처음 한 번만 하면 되고, 이후에는 `main` 브랜치에 push 하면 Vercel 이 자동 배포합니다.

| 구성 | 역할 | 예상 비용(월) |
|---|---|---|
| Vercel Pro | Next.js 호스팅 · 도메인 · HTTPS | $20 (Hobby 무료 플랜은 상업용 사용 불가) |
| Neon (Free) | Postgres DB — 게시글·갤러리 정보 | $0 (0.5GB까지) |
| AWS S3 + CloudFront | 업로드 이미지 저장·전송 | $1~3 |

---

## 1. Neon (DB)

1. https://neon.tech 가입 → **Create project** (Region: `AWS Asia Pacific (Seoul)` 또는 가장 가까운 곳).
   - Vercel 대시보드 → Storage → **Neon** 연동으로 만들면 `DATABASE_URL` 이 자동 등록됩니다.
2. **Connection string** 복사 (`postgresql://...neon.tech/neondb?sslmode=require`).
3. 테이블 생성 (둘 중 하나, 여러 번 실행해도 안전):
   - 로컬에서: `DATABASE_URL='복사한주소' npm run db:init`
   - 또는 Neon 콘솔 **SQL Editor** 에 `src/db/bootstrap.sql` 내용을 붙여넣고 실행.

## 2. AWS S3 + CloudFront (이미지)

### 2-1. S3 버킷
- 리전 `ap-northeast-2 (서울)`, 이름 예: `sangsangmaru-images`
- **퍼블릭 액세스 차단: 모두 켜둠** (CloudFront 로만 공개)
- 버킷 → 권한 → **CORS** (관리자 브라우저에서 직접 업로드하기 위함):

```json
[
  {
    "AllowedOrigins": ["https://imaginemaru.kr", "https://www.imaginemaru.kr", "http://localhost:3000"],
    "AllowedMethods": ["PUT"],
    "AllowedHeaders": ["Content-Type"],
    "MaxAgeSeconds": 3000
  }
]
```

### 2-2. CloudFront
- 원본: 위 S3 버킷, **Origin access control(OAC)** 생성 후 안내에 따라 버킷 정책 업데이트
- 캐시 정책: `CachingOptimized`
- 배포 후 도메인(예: `d1abcd2efgh3.cloudfront.net`)을 `NEXT_PUBLIC_CDN_DOMAIN` 에 사용
- (선택) `img.imaginemaru.kr` 같은 커스텀 도메인 연결 시 ACM 인증서(us-east-1) 필요

### 2-3. IAM 사용자 (업로드 전용 키)
IAM → 사용자 생성 → 아래 인라인 정책만 부여 → **액세스 키** 발급

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::sangsangmaru-images/*"
    }
  ]
}
```

## 3. 관리자 비밀번호 / 세션 키

```bash
npm run hash-password -- '관리자비밀번호(10자 이상)'   # → ADMIN_PASSWORD_HASH 값
openssl rand -base64 32                                # → AUTH_SECRET 값
```

## 4. Vercel

1. https://vercel.com → **Add New Project** → GitHub 저장소 `sangsangweb` 선택 (Framework: Next.js 자동 인식)
2. **Environment Variables** (Production · Preview 모두):

| 이름 | 값 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://imaginemaru.kr` |
| `DATABASE_URL` | Neon 연결 문자열 |
| `AWS_REGION` | `ap-northeast-2` |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | 2-3 에서 발급한 키 |
| `S3_BUCKET` | `sangsangmaru-images` |
| `NEXT_PUBLIC_CDN_DOMAIN` | CloudFront 도메인 (https:// 제외) |
| `ADMIN_ID` | 관리자 아이디 |
| `ADMIN_PASSWORD_HASH` | 3 에서 만든 값 |
| `AUTH_SECRET` | 3 에서 만든 값 |
| `NAVER_SITE_VERIFICATION` | (6 에서 받은 값, 나중에 추가 가능) |
| `GOOGLE_SITE_VERIFICATION` | (6 에서 받은 값, 나중에 추가 가능) |

3. **Deploy** → 발급된 `*.vercel.app` 주소에서 동작 확인
4. 오픈 시 **Settings → Plan → Pro** 로 전환 (클라이언트 사이트는 상업용)

> `NEXT_PUBLIC_*` 값이나 검증 코드를 바꾼 뒤에는 **Redeploy** 해야 반영됩니다.

## 5. 도메인 연결 (imaginemaru.kr)

1. Vercel → Project → **Settings → Domains** → `imaginemaru.kr`, `www.imaginemaru.kr` 추가 (www → apex 리디렉트 권장)
2. 도메인 등록처(가비아/후이즈 등) DNS 관리에서 Vercel 이 안내하는 레코드 입력
   - `@` → A 레코드 (Vercel 안내 IP)
   - `www` → CNAME `cname.vercel-dns.com`
3. HTTPS 인증서는 자동 발급
4. 새 사이트 정상 동작 확인 후 미리넷 호스팅 해지 (기존 주소 `/pages/*.html` 는 새 주소로 301 리디렉트되도록 설정되어 있음)

## 6. 검색엔진 등록 (가장 중요)

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

## 7. 배포 후 점검 체크리스트

- [ ] `https://imaginemaru.kr/robots.txt` 에 `Disallow: /admin`, Sitemap 주소 표시
- [ ] `https://imaginemaru.kr/sitemap.xml`, `/rss.xml` 정상
- [ ] 페이지 소스 보기에서 `<title>`, `description`, `og:image`, `canonical`, `naver-site-verification` 확인
- [ ] `/admin` 로그인 → 글 작성(이미지 포함) → 홈·목록·상세에 즉시 반영
- [ ] 갤러리 사진 업로드 → 이미지 주소가 CloudFront 도메인인지 확인
- [ ] 카카오톡/페이스북에 주소 공유 시 미리보기 이미지 표시
- [ ] 옛 주소(예: `/pages/about/history.html`)가 새 주소로 301 이동
