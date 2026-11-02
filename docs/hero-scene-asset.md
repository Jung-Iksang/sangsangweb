# Hero 소개 카드의 미래교육 일러스트

오른쪽 상단 카드의 기존 SVG 로봇·드론을 어린이·로봇·드론이 함께 체험하는 하나의 3D 장면으로 교체했다. 카드 외곽 크기와 기존 문구·링크는 유지한다.

- 최종 에셋: `public/illustrations/hero-future-learning-v1.png`
- 제작 방식: 내장 `image_gen` 도구 사용. 외부 API·CLI를 사용하지 않았다.
- 원본 규격: 1086×1448px PNG, 실제 투명 알파 채널, 약 1.53MiB.
- 렌더링: `HeroEducationCharacters.tsx`의 Next.js `Image`가 `fill`, 화면별 `sizes`, `object-fit: contain`으로 최적화한다. 자르거나 왜곡하지 않는다.
- 접근성: 기존 텍스트를 보조하는 장식 이미지로 `alt=""`, `aria-hidden="true"`를 사용한다.
- 카드 배경: #FFF9F0에서 #E8F3FF로 이어지는 은은한 그라데이션과 #D9EBFF 계열의 부드러운 강조. 제목 #142B49, 강조 #2563C7.
- 작업 범위: 상단 카드의 그림·배경·제목 색상만 변경. 헤더, 슬라이더, 하단 안내 카드와 다른 섹션은 유지한다.

## 검증 및 화면 캡처

- Chrome 390·768·1024·1280·1440·1784·1920px에서 이미지 최적화·로딩, 텍스트 두 줄 유지, 글자와 이미지의 겹침 없음, 이미지 전체 표시를 확인했다.
- 헤더·Hero·메인 슬라이더·상단 카드·하단 카드의 위치와 크기를 기존 측정값과 비교했고 모든 화면에서 동일했다.
- 하단 안내의 통일된 글자 크기와 굵기 700도 유지했다.
- `npm run lint`, `npm run typecheck`, `npm run build` 통과. 브라우저 런타임 오류 없음.
- 측정 기록: Git 제외 경로 `.data/hero-3d-scene-validation.json`.
- 전체 적용 화면: `.data/uiux-hero-3d-scene-1784.png`, `.data/uiux-hero-3d-scene-1280.png`, `.data/uiux-hero-3d-scene-390.png`.
- 카드 확대 캡처: `.data/hero-3d-scene-card-1784.png`, `.data/hero-3d-scene-card-1280.png`, `.data/hero-3d-scene-card-390.png`. 브라우저 DPR 2로 캡처했다.

## 후속 타이포그래피 조정

- 카드·배경·캐릭터 에셋 및 이미지 위치는 유지하고, `Hero.css`의 문구 스타일만 조정했다.
- 상단 문구: 13px·600, #2453A0, 자간 .015em, 행간 1.5.
- 제목: 데스크톱 24~28px·750, #102747 / #205BC0, 자간 -.03em, 행간 1.3. 1280px 실측 24px, 1440px 25.28px. 작은 모바일은 공간에 맞춰 19~21px로 조정한다.
- 설명: 14.5~15px·450, #334155, 행간 1.55. 링크: 15px·600, #174EA6, 화살표 간격 14px. 호버·키보드 포커스에서 색상과 밑줄로 강조한다.
- ‘포토갤러리’ 표기는 홈·메뉴·목록·페이지 메타데이터·관리 화면에서 ‘갤러리’로 통일했다. 기존 URL과 로직은 유지한다.
- 320·360·390·768·1024·1280·1440·1784·1920px에서 줄바꿈·겹침·잘림을 확인했다. 카드와 캐릭터의 치수 및 상대 위치, 배경색이 이전과 동일함을 확인했다.
- 갤러리 목록·상세 페이지 응답 200 확인. 현재 로컬 데이터는 10개로 한 페이지이며, 범위 밖의 2페이지는 기존대로 404를 반환한다.
- TypeScript·Lint·Build 통과, 런타임 오류 없음. 검증 기록 `.data/hero-type-gallery-validation.json`, 화면 `.data/uiux-hero-type-1440.png`, `.data/uiux-hero-type-1280.png`.

## 최종 이미지 생성 프롬프트

```text
Use case: stylized-concept.
Asset type: a production-quality transparent PNG cutout illustration for the RIGHT SIDE of a Korean public children's future-education website introduction card, displayed at about 180 by 220 CSS pixels.
Primary request: ONE cohesive, lovingly art-directed premium 3D animated illustration scene of a Korean primary-school child aged about 9, a friendly educational robot, and a small flying quadcopter. They must look like they are doing an activity together, not three separate icons.
Composition: portrait 3:4 canvas, tightly grouped with modest 5% transparent breathing room around every edge. Full-body child at lower left holds a blue tablet-style drone controller in both hands, curious happy expression looking slightly up at the drone. The child has short dark hair, school-age proportions (not a toddler or baby), a soft blue casual top, cream trousers, simple sneakers. A small rounded white and blue robot stands close at the child's lower right, looking toward the same drone and gently pointing upward, navy display face with expressive cyan LED eyes. The robot is about two-thirds the child's height. The drone hovers directly above the pair, close enough to create a single compact triangular composition, with four clearly visible round propeller guards, white-blue shell. Very subtle pale blue curved flight trail connects the shared activity. Both characters share the SAME ground plane and a single soft small contact shadow, not separate floating podiums.
Style: polished high-end 3D animation still, softly rounded sculpted forms, beautiful clean modeling, convincing ambient occlusion, subtle material texture, soft studio light from upper left, pastel blue and white palette with natural warm skin, restrained refined public-education institution tone. Cute and engaging but not infantile. Readable silhouettes at small website-card sizes. NO flat vector art, NO SVG/icon aesthetic, NO emoji, NO plastic toy product photo.
Backdrop: genuinely TRANSPARENT alpha outside the subjects. No colored rectangular background, no environment, no card UI, no typography, no labels, no watermarks, no logos. Never crop heads, drone propellers, hands, feet, or soft shadow. Do not include any extra people or objects.
```
