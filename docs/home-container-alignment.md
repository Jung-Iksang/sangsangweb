# 홈페이지 가로 정렬 통일

## 원인과 수정

헤더와 Hero는 최대 1430px·수평 외부 여백 30px의 규칙을 사용했지만, 하단은 최대 1550px·내부 패딩 15px를 사용했다. 프로그램에는 별도로 최대 1600px·내부 패딩 48px가 적용됐다. 1784px와 1920px에서 일반 하단 콘텐츠가 헤더보다 45px, 프로그램이 37px 왼쪽으로 나오는 것을 실제 DOM으로 확인했다.

기존 `Header.css`의 컨테이너 선택자에 `.site-content-frame`을 추가했다. 헤더·Hero가 사용하던 설정 자체는 그대로이며, 하단 섹션의 바깥 클래스만 이 규칙으로 연결했다.

```css
.site-header-frame, .hero-layout, .site-content-frame {
  width: calc(100% - 3.75rem);
  max-width: 89.375rem;
  margin-inline: auto;
}
@media (max-width: 799px) {
  .site-header-frame, .hero-layout, .site-content-frame {
    width: calc(100% - 1.875rem);
  }
}
```

계산 기준은 현재 프로젝트의 16px 루트 글자 크기다. 별도 수평 내부 패딩을 중복 적용하지 않으며, 기존 Tailwind 초기화의 `box-sizing: border-box`를 사용한다.

## 적용 위치

- `src/components/layout/Header.css`: 공통 컨테이너 규칙.
- `src/components/home/AboutIntro.tsx`: 사진·소개·메인 연혁 실적을 감싸는 컨테이너.
- `src/components/home/AboutIntro.css`: 태블릿의 별도 44rem 최대 폭을 제거해 사진·텍스트가 공통 경계 안에서 정렬되도록 했다.
- `src/components/home/CareerSection.tsx`: 제목과 6개 카드의 외곽 컨테이너.
- `src/components/home/Programs.tsx`, `Programs.css`: 9개 프로그램 컨테이너 통일, 별도 1600px·48px 패딩 규칙 제거. 축구장 배경과 카드·슬라이더 구조는 유지한다.
- `src/components/home/NewsBoards.tsx`: 공지사항·갤러리 그리드 외곽 컨테이너.
- `src/components/home/Partners.tsx`: 협력기관 컨테이너.
- `src/components/layout/Footer.tsx`: 푸터 콘텐츠 컨테이너. 공유 푸터에도 동일한 헤더 정렬 기준을 적용한다.

홈의 연혁은 기관 소개 내부의 자동 전환 실적 영역이다. 독립 연혁 섹션을 추가하거나 `/about/history`의 본문 컨테이너를 변경하지 않았다. 폰트·색상·이미지·배경·카드 스타일·섹션 순서·데이터·라우팅·API는 유지했다.

## 브라우저 실측 결과

Chrome DPR 1 기준. 헤더·Hero·기관소개·직업세계·프로그램·공지사항/갤러리·협력기관·푸터의 콘텐츠 좌우 경계를 비교했다. 브라우저의 세로 스크롤바 공간은 제외된 계산값이다.

| 화면 너비 | 공통 왼쪽 X | 공통 오른쪽 X | 콘텐츠 폭 | 최대 경계 차이 |
| --- | --- | --- | --- | --- |
| 390 | 15 | 360 | 345 | 0px |
| 768 | 15 | 738 | 723 | 0px |
| 1024 | 30 | 979 | 949 | 0px |
| 1280 | 30 | 1235 | 1205 | 0px |
| 1440 | 30 | 1395 | 1365 | 0px |
| 1784 | 169.5 | 1599.5 | 1430 | 0px |
| 1920 | 237.5 | 1667.5 | 1430 | 0px |

다음 사항도 확인했다.

- 헤더·Hero 컨테이너, 로고, 메인 사진, 소개 카드, 캐릭터와 안내 카드의 X·Y·너비·높이가 수정 전과 동일하다.
- 각 섹션의 제목 글자 크기·굵기·색상, Hero 배경·카드 배경, 프로그램의 시그니처 그린이 수정 전과 동일하다.
- 기관 소개 사진·직업세계 제목과 그리드·프로그램 제목과 첫 카드·공지사항 제목·협력기관 그리드의 왼쪽 경계가 공통 시작점과 일치한다.
- 가로 넘침 없음, 직업세계 6개·프로그램 9개 유지, 소개 사진 원본 비율 유지.
- 프로그램 다음 버튼의 슬라이드 이동과 연혁 자동 전환 정상. 연도와 기존 설명이 일치한다.
- 좁아진 컨테이너에서 모든 기존 연도별 업적을 측정해 실적 영역의 높이가 일정함을 확인했다.
- `npm run typecheck`, `npm run lint`, `npm run build` 통과. 브라우저 런타임 오류 없음.

측정 기록은 Git 제외 경로 `.data/home-alignment-before.json`, `.data/home-alignment-validation.json`, `.data/home-alignment-functions.json`에 보관한다. 화면 캡처는 `.data/uiux-aligned-{너비}-{about|career|program|news|footer}.png`다.
