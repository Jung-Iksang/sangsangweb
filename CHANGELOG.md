# 변경 이력

## v1.0 — 2026-10-28 · 디자인 방향 확정

기존 정적 HTML + PHP(미리넷) 사이트를 Next.js 16 기반으로 전면 리뉴얼.

### 추가
- Next.js 16 (App Router, Cache Components) + Tailwind 4 프로젝트, Vercel 배포 구성
- hamsungedu.co.kr 레이아웃을 참고한 메인: 분할 히어로, 소개, 주요사업, 진로 6단계, 소식 게시판, 갤러리 캐러셀, 문의 배너, 협력기관
- 기존 상단 메뉴 구성 유지 + 모바일 햄버거 메뉴, 메뉴 설정 파일 일원화(`src/config/menu.ts`)
- 기존 페이지 콘텐츠 이식: 인사말·연혁·오시는 길, 교육활동 6종, 체험활동 4종, 진로·직업체험 소개, 스토어(준비 중)
- 공지사항·보도자료·포토갤러리 (Neon Postgres / Drizzle)
- 관리자 `/admin`: 단일 계정 로그인, 게시글 작성·수정·숨김·삭제(Tiptap 에디터, 본문 이미지), 갤러리 다중 업로드·수정·삭제
- 이미지 저장소: S3 presigned 업로드 + CloudFront (로컬은 파일 저장소), 브라우저 리사이즈(WebP)
- SEO: 페이지별 메타·canonical·OG, JSON-LD, sitemap.xml, robots.txt, rss.xml, 검색봇용 완성 HTML, 기존 주소 301 리디렉트, 네이버·구글 소유확인 환경변수
- 로컬 개발 DB(PGlite) + 예시 데이터, 목업 이미지 생성 스크립트, 배포 가이드(`docs/DEPLOY.md`)

### 제거
- 회원가입·일반 로그인 기능 (관리자 전용으로 변경)
- PHP 백엔드 (기존 코드는 `old/` 에 보관)

### 미완료
- 운영 인프라(Neon·S3·Vercel·도메인) 실제 연결 및 검증
- 실제 사진 교체, 지도 삽입
