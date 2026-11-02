# 상상마루 UI/UX 개선 기록

기존 `feat/responsive-desktop-layout` 브랜치의 변경사항 위에서 작업했다. 메인 섹션의 순서, 기존 경로, 프로그램·연혁 원본 데이터, API 및 관리자 기능을 유지했다. 패키지를 추가하지 않았고 환경변수 파일을 열람하거나 수정하지 않았다.

## 디자인 및 사용자 경험

- 공개 사이트의 색상은 네이비·블루·화이트를 기본으로 한다. 프로그램 영역은 시그니처인 초록 축구장 디자인을 유지한다. 기존 의미 기반 Tailwind 유틸리티는 공개 레이아웃 안에서 새 색상을 사용하며 관리자 색상은 유지한다.
- 콘텐츠는 중앙 정렬과 최대 너비를 유지한다. 시립과학관 치수 비교 작업에 따라 기본·공지·갤러리 영역은 `96.875rem`(1550px), 프로그램은 PC에서 `100rem`까지 허용한다. PC 메뉴는 20px, 메뉴 줄 높이는 90px이며, 큰 화면의 추가 확대 배율은 제거했다. 프로그램은 PC 4열, 모바일은 카드 1장이 가로 폭에 맞게 표시된다.
- Hero는 [서울시립과학관 메인 화면](https://science.seoul.go.kr/main)의 구성을 참고하여 왼쪽의 큰 사진 슬라이드, 오른쪽 상단 소개 배너, 오른쪽 하단 교육 안내로 나눴다. 기존 상상마루 사진·제목과 슬라이드 동작을 활용하고, 하단에 흰색 슬라이드 컨트롤을 배치했다. 안내에는 기존 연락처·주소와 프로그램·문의·오시는 길 링크를 사용하며, 확인되지 않은 운영시간이나 관람료는 추가하지 않았다.
- Hero는 수동 탐색 후 자동재생을 멈춘다. 마우스 진입, 키보드 포커스, 화면 밖, 비활성 탭 및 reduced-motion 설정을 고려한다. 첫 사진에만 preload를 사용하며 기존의 허용되지 않은 quality=90 지정은 제거했다.
- 6가지 직업세계는 기존 설명·태그·번호를 사용해 이미지 → 제목 → 특징 → 학습 내용 → 상세 링크의 순서로 구성했다. 링크는 기존 `/career#school-XX`를 유지한다.
- 메인 연혁은 2012년부터 2초 간격으로 시간순 순환하며 연도와 대표 업적이 함께 바뀐다. 사용자 요청으로 조작 버튼 없이 자동 진행하며, 화면 밖과 비활성 탭에서는 진행을 멈춘다. reduced-motion에서는 이동 애니메이션을 생략한다. 별도 '배움으로 이어 온 시간' 영역은 제거하여 소개·통계 다음에 6가지 직업세계가 바로 이어진다.
- 별도 전체 연혁 페이지는 시간순 세로 타임라인과 스크롤 기반 현재 연도·진행선을 유지한다.
- 공통 스크롤 진입 효과는 콘텐츠가 기본적으로 읽히는 상태에서 시작한다. JavaScript 미사용 또는 reduced-motion 환경에서도 내용이 숨겨지지 않는다.
- 모바일 메뉴는 열릴 때 내부로 포커스를 옮기고 Tab 순환, Escape 닫기, 닫은 뒤 포커스 복귀, 데스크톱 전환 시 스크롤 복원을 지원한다. 닫힌 하위 링크는 inert로 키보드 탐색에서 제외한다.

## 수정한 파일

| 영역 | 파일 |
| --- | --- |
| 공통 디자인 | `src/app/globals.css`, `src/app/(site)/layout.tsx` |
| Hero | `src/components/home/Hero.tsx`, `Hero.css` |
| 직업세계 | `src/components/home/CareerSection.tsx`, `CareerSection.css` |
| 소개·통계 | `src/components/home/AboutIntro.tsx`, `AboutIntro.css`, `AboutIntroStats.tsx`, `AboutIntroReveal.tsx` |
| 공통 연혁 | `src/components/history/HistoryTimeline.tsx`, `HistoryTimeline.css`, `src/lib/history.ts` |
| 연혁 페이지 | `src/app/(site)/about/history/page.tsx` |
| 프로그램 | `src/components/home/Programs.tsx`, `Programs.css`, `ProgramSlider.tsx` |
| 소식·갤러리 | `src/components/home/NewsBoards.tsx`, `NewsBoards.css` |
| 탐색·접근성 | `src/components/layout/MainNav.tsx`, `MobileMenu.tsx`, `ScrollTopButton.tsx` |
| 모션 공통화 | `src/components/ui/ScrollReveal.tsx`, `useReducedMotion.ts` |
| 연혁 회귀 검사 | `scripts/history.test.mjs` |

스타일은 현재 프로젝트의 CSS 로더와 기존 컴포넌트 방식을 따라 `hero-*`, `history-*` 등 영역별 클래스 이름으로 제한한다. 라우트 이동 후 스타일이 남아도 다른 영역과 충돌하지 않도록 구성했다.

프로그램 영역은 사용자 요청에 따라 기존 잔디 체크무늬·풀잎·경기장 선·센터 서클·그물 펜스·링 골대·드론축구공과 Paperlogy 서체를 복원했다. 초록색 토큰은 이 영역에만 적용하며, 개선한 카드 크기·반응형·슬라이더 동작은 유지한다.

## 사진 검토와 후속 보완

| 프로그램 | 확인 결과 및 적용 |
| --- | --- |
| 드론 | 기존 `drone-class.webp` 활용 |
| 코딩 | 기존 `hero-education.webp` 활용 |
| 로봇 | 로봇 조작 장면이 확인된 `career-robot.webp` 활용 |
| 3D프린터 | 기존 `career-maker.webp`는 로봇 부품 조립 장면이므로 전용 사진으로 사용하지 않음. 프로그램 기술 아이콘과 기존 설명을 표시 |
| VR/AR | 기존 `career-startup.webp`는 창업 안내 배너이므로 전용 사진으로 사용하지 않음. 기술 아이콘과 기존 설명을 표시 |
| IoT | 로봇 조립 사진의 중복 사용을 제거하고 기술 아이콘과 기존 설명을 표시 |

향후 3D프린팅·VR/AR·IoT의 실제 수업 사진을 확보하면 해당 카드의 시각 영역만 교체할 수 있다. Hero 원본도 고해상도 사진을 확보하면 큰 화면의 선명도를 더 높일 수 있다. 새로운 프로그램 정보나 가상의 현장 사진은 만들지 않았다.

## 검증

- `npm.cmd run lint`
- `npm.cmd run typecheck`
- `node --experimental-strip-types --test scripts/history.test.mjs`: 시간순 정렬, 연도·설명 결합, 원본 불변성, 빈 배열·동일 연도 보존 검사
- 로컬 DB를 연결한 `npm.cmd run build`: 기존 68개 정적 페이지 생성
- Chrome 헤드리스: 390 / 768 / 1024 / 1280 / 1440 / 1920px에서 가로 넘침, 헤더 겹침, 6개 직업세계와 9개 프로그램 유지 확인
- 390 / 1920px 연혁 페이지의 전체 14개 연도·설명을 원본과 대조하고 2020년 스크롤 강조 확인
- 메인 연도 선택과 설명 연결, Hero 수동 이동, 모바일 메뉴 포커스·Escape, reduced-motion 자동재생 중지 확인
- 주요 공개 경로 및 관리자 로그인 페이지 진입, 브라우저 런타임 오류 확인

브라우저 검증 결과와 화면 캡처는 Git에서 제외된 `.data/uiux-validation.json`, `.data/uiux-*.png`에 보관한다. 실제 모바일 기기 및 스크린리더 사용성 평가는 후속 점검 대상이다.
