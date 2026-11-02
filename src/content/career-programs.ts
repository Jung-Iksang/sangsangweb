/**
 * 진로·직업체험 프로그램 — 출처: 「2026년 진로·진학·직업체험(특강) 프로그램 운영 계획(안)」(34쪽)과 「요약」(4쪽) PDF
 * (저장소 루트, git 제외). 요약에만 있는 프로그램은 세부 내용 없이 이름만 싣는다.
 *
 * 사진: scripts/import-photos.mjs 의 pdfMap 이 cp-<slug>, cp-<slug>-2 … 로 만든다 (programPhotos 가 찾아 줌).
 * 강사 현장 사진: 관리자 포토갤러리 앨범의 "연결 프로그램"(gallery.program_slug) 이 이 slug 를 가리킨다.
 */
import { photos, type PhotoName } from "./photos.generated";

export type CareerThemeSlug = "ai-coding" | "drone" | "maker" | "xr" | "robot-smartfarm" | "baekje" | "craft" | "jobs" | "science";

export type CareerTheme = {
  slug: CareerThemeSlug;
  title: string;
  /** 메인·카드용 한 줄 */
  tagline: string;
  /** 분류 페이지 머리 소개 */
  desc: string;
  image: PhotoName;
  /** 메인 "직업세계" 카드에 노출 (6개) */
  featured?: boolean;
  keywords: string[];
};

export type CareerProgram = {
  slug: string;
  title: string;
  theme: CareerThemeSlug;
  /** 관련 직업 (요약표 괄호 안 표기) */
  job?: string;
  /** PDF 사진 위 홍보 문구 */
  tagline?: string;
  /** 운영 형태 — 없으면 학교와 협의 */
  formats?: Format[];
  /** 수업 내용 (PDF "내용" 칸) */
  outline: string[];
  /** cp-* 사진 앞에 둘 기존 사진 */
  leadPhotos?: PhotoName[];
};

export type Format = "체험" | "특강";
export const formatLabel: Record<Format, string> = { 체험: "체험 40분", 특강: "특강 2시간(2교시)" };
const both: Format[] = ["체험", "특강"];
const expOnly: Format[] = ["체험"];

/** 운영 공통 안내 (PDF 1쪽·각 표) */
export const careerOverview = {
  goal: "4차 산업혁명 시대 진로·진학·직업체험 길라잡이",
  mission: "체험을 통해 실질적인 진로 선택의 폭을 넓히는 다양하고 창의적인 진로 경로 설계 지원",
  instructors: 25,
  fee: "강사비 및 재료비는 학교 및 회사 내규에 따릅니다.",
  request: "이 밖에 학교에서 원하는 진로·직업체험도 알려 주세요.",
};

export const careerThemes: CareerTheme[] = [
  {
    slug: "ai-coding",
    title: "AI·코딩",
    tagline: "인공지능을 체험하고, 코딩해 보자!",
    desc: "자율주행 자동차·생성형 AI·코딩 로봇으로 인공지능과 프로그래밍의 원리를 배우고, 인공지능 전문가의 일을 미리 경험합니다.",
    image: "cp-ai-car",
    featured: true,
    keywords: ["인공지능 진로체험", "AI 체험", "코딩 체험", "ChatGPT 수업", "자율주행 자동차 체험"],
  },
  {
    slug: "drone",
    title: "드론",
    tagline: "드론(Drone)을 꿈(Dream)꾸자!",
    desc: "드론의 종류와 안전 수칙부터 비행·코딩·드론축구·군집 비행까지. 드론 전문가의 길을 직접 조종하며 알아봅니다.",
    image: "cp-drone-dream",
    featured: true,
    keywords: ["드론 진로체험", "드론 코딩", "드론축구 체험", "군집드론"],
  },
  {
    slug: "maker",
    title: "3D·메이커",
    tagline: "생각을 현실로 만드는 메이커",
    desc: "3D 모델링·3D 펜·레이저 각인·승화전사·LED 무드등으로 내 디자인을 실제 작품으로 만들어 봅니다.",
    image: "cp-3d-modeling",
    featured: true,
    keywords: ["3D프린터 체험", "3D펜", "메이커 교육", "레이저 각인", "LED 무드등 만들기"],
  },
  {
    slug: "xr",
    title: "VR·AR·메타버스",
    tagline: "현실 같은 가상, 가상 같은 현실",
    desc: "홀로그램·가상현실(VR)·증강현실(AR)·360도 영상·메타버스로 실감 미디어 기술과 관련 직업을 체험합니다.",
    image: "cp-hologram",
    featured: true,
    keywords: ["VR 체험", "AR 체험", "메타버스 체험", "홀로그램 만들기", "실감미디어 진로"],
  },
  {
    slug: "robot-smartfarm",
    title: "로봇·스마트팜",
    tagline: "로봇 코디네이터와 스마트팜 전문가",
    desc: "로봇을 만들고 겨루며 로봇공학자의 일을, 아두이노 키트로 스마트팜 기술을 실습하며 미래 농업을 만나 봅니다.",
    image: "cp-smart-farm",
    keywords: ["로봇 진로체험", "로봇공학자", "스마트팜 체험", "아두이노"],
  },
  {
    slug: "baekje",
    title: "백제문화유산",
    tagline: "옛 것도 첨단이다!",
    desc: "유네스코 세계유산 백제역사유적지구(공주·부여·익산)의 문화재와 문양을 LED 한지등·주사위·입체퍼즐·오토마타로 만들며 역사와 기술을 함께 배웁니다.",
    image: "cp-k-heritage-led",
    featured: true,
    keywords: ["백제문화 체험", "백제역사유적지구", "문화유산 만들기", "익산 체험학습", "LED 한지등"],
  },
  {
    slug: "craft",
    title: "공예·아트",
    tagline: "손끝으로 여는 공예 세상",
    desc: "한지·가죽·매듭·민화·팝아트·테라리움·자개 키링까지. 다양한 공예가와 아티스트의 일을 작품을 완성하며 경험합니다.",
    image: "cp-fancy-wood",
    featured: true,
    keywords: ["공예 체험", "민화 체험", "가죽공예", "테라리움", "공예가 진로"],
  },
  {
    slug: "jobs",
    title: "직업탐색·진로",
    tagline: "꿈을 찾고 행복을 찾는 진로",
    desc: "진로 흥미 검사와 상담, 크리에이터·조향사·쇼콜라티에·바리스타·치료사 등 다양한 직업을 직접 해 보며 나에게 맞는 길을 찾습니다.",
    image: "cp-perfumer",
    keywords: ["직업체험", "진로상담", "홀랜드 검사", "조향사 체험", "직업탐색"],
  },
  {
    slug: "science",
    title: "과학",
    tagline: "만들고 놀며 배우는 과학",
    desc: "지구과학·화학·물리·생물 체험을 학년·학급·학교 수준에 맞춰 협의해 진행합니다.",
    image: "cp-science-2",
    keywords: ["과학 체험", "과학 진로체험", "과학 만들기"],
  },
];

export const careerPrograms: CareerProgram[] = [
  // ── AI·코딩 ─────────────────────────────────────────
  {
    slug: "ai-car",
    title: "인공지능(AI) 자동차",
    theme: "ai-coding",
    job: "인공지능 전문가",
    formats: both,
    outline: ["인공지능(AI)이란?", "인공지능 활용 예시", "자율주행 자동차 플랫폼으로 인공지능·딥러닝·머신러닝의 기본 개념 이해", "인공지능으로 배우는 나의 미래 찾아보기"],
  },
  {
    slug: "chatgpt",
    title: "생성형 AI(ChatGPT) 체험",
    theme: "ai-coding",
    job: "인공지능 전문가",
    formats: both,
    outline: ["인공지능(AI)이란?", "ChatGPT란?", "ChatGPT 활용법", "ChatGPT로 신문기사·소설·여행 일정 등 작성하기", "ChatGPT 윤리"],
  },
  {
    slug: "ai-coding-lab",
    title: "인공지능(AI) 코딩",
    theme: "ai-coding",
    job: "인공지능 전문가",
    tagline: "인공지능을 체험하고, 코딩해 보자!",
    formats: both,
    outline: ["인공지능이란?", "특징 추출과 분류기·신경망으로 이미지·문자·음성 인식 등 인공지능 기능 이해", "딥러닝 기술 이해하기"],
  },
  {
    slug: "ai-game-coding",
    title: "인공지능 전문가 — 게임 코딩",
    theme: "ai-coding",
    job: "컴퓨터활용 전문가",
    tagline: "프로그래밍과 함께하는 창의력! 코드로 여는 미래",
    formats: both,
    outline: ["컴퓨터활용 전문가 직업 탐색", "프로그래밍의 기본 개념과 원리 이해", "뤼튼을 이용한 게임 개발 기초와 활용 방법", "게임 아이디어 브레인스토밍과 기본 구조 설계", "뤼튼으로 간단한 게임 코딩 실습"],
  },
  {
    slug: "kamibot",
    title: "카미봇PI 코딩 교실",
    theme: "ai-coding",
    job: "인공지능 전문가",
    tagline: "선과 도형으로 만드는 세상! 카미봇PI 코딩",
    formats: both,
    outline: [
      "카미봇PI의 구조와 센서 이해하기",
      "순차 코딩으로 카미봇PI를 직선·곡선으로 움직이기",
      "바닥의 선을 따라가는 라인 트레이싱 원리 학습",
      "펜 홀더에 펜을 꽂고 정삼각형·정사각형 그리기",
      "'반복문' 블록으로 효율적인 도형 코딩",
      "나만의 '도형 지도'를 만들어 카미봇PI로 여행하기",
    ],
  },
  {
    slug: "coding-club",
    title: "코딩(coding) 클럽",
    theme: "ai-coding",
    formats: both,
    outline: ["4차 산업혁명을 알아보다!", "코딩이란? (코딩 환경 알기·프로그램 설치)", "코딩 블록 배우기 (말하기·생각하기·이동하기·보이기·숨기기 등)", "프로그램이 주는 미래의 변화: 코딩과 IoT", "미리 준비하는 미래 직업, 진로 탐색"],
  },
  {
    slug: "coding-story",
    title: "코딩 스토리텔링",
    theme: "ai-coding",
    tagline: "스크래치로 만드는 서동선화 스토리텔링",
    formats: both,
    outline: ["4차 산업혁명 시대", "코딩이란?", "코딩 블록 배우기", "프로그램이 주는 미래의 변화", "스크래치로 만드는 서동선화 이야기", "미리 준비하는 미래 직업, 진로 탐색"],
  },
  {
    slug: "altino-racing",
    title: "알티노 자동차 레이싱",
    theme: "ai-coding",
    job: "인공지능 전문가",
    tagline: "알티노 레이싱",
    formats: both,
    outline: ["인공지능과 자율주행 자동차", "인공지능의 활용 예시", "인공지능과 자율주행 자동차로 배우는 나의 미래 찾기", "알티노 AI 자동차를 조종해 레이싱 경기 체험"],
  },

  // ── 드론 ────────────────────────────────────────────
  {
    slug: "drone-dream",
    title: "드론(Drone)을 꿈(Dream)꾸자!",
    theme: "drone",
    job: "드론 전문가",
    formats: both,
    outline: ["드론이란? 드론의 종류와 활용 사례", "드론 안전 수칙 숙지", "드론을 활용한 나의 미래 찾아보기", "드론 초급 비행 및 중급 비행", "드론 미션 비행"],
  },
  {
    slug: "drone-coding",
    title: "드론 코딩",
    theme: "drone",
    job: "드론 전문가",
    formats: both,
    outline: ["드론이란? 드론의 종류와 활용 사례", "코드론2를 활용한 드론 코딩", "드론을 활용한 나의 미래 찾아보기", "코딩으로 미션 수행하기"],
  },
  {
    slug: "drone-soccer-class",
    title: "드론축구(Drone Soccer)",
    theme: "drone",
    job: "드론 전문가",
    tagline: "드론으로 할 수 있는 레저스포츠! 드론축구",
    formats: both,
    outline: ["드론(Drone)의 이해", "축구드론 조종 및 드론축구 경기 규정 이해하기", "축구드론 초기 비행", "미션 수행 (드론 농구)"],
    leadPhotos: ["drone-festival"],
  },
  {
    slug: "swarm-drone",
    title: "드론 코딩(군집드론)",
    theme: "drone",
    job: "드론 전문가",
    tagline: "다 같이 움직여 보자!! 군집 드론",
    formats: both,
    outline: ["드론이란? 드론의 종류와 활용 사례", "드론 안전 수칙 숙지", "드론을 활용한 나의 미래 찾아보기", "드론 코딩", "드론 코딩을 통한 미션 비행"],
  },
  {
    slug: "heritage-drone",
    title: "문화재, 드론의 눈으로 바라보기",
    theme: "drone",
    tagline: "옛 것도 첨단이다!",
    formats: both,
    outline: ["드론이란?", "연습 비행", "드론으로 문화재 촬영", "영상 편집 앱 설치 및 편집 기술", "촬영 영상 편집 및 개인 SNS·유튜브 업로드", "미리 준비하는 미래 직업, 진로 탐색"],
  },

  // ── 3D·메이커 ───────────────────────────────────────
  {
    slug: "3d-modeling",
    title: "3D 모델링 디자이너",
    theme: "maker",
    job: "3D 전문가",
    tagline: "생각을 현실로 만드는 3D 모델링 디자이너",
    formats: both,
    outline: ["4차 산업혁명을 알아보다!", "3D 프린팅 과정을 알아보고 직접 모델링 해 보기", "123D Design·CADian3D·Fusion360·TinkerCad 등으로 모델링", "3D 프린터를 활용한 나의 미래 찾아보기"],
  },
  {
    slug: "3d-pen",
    title: "STEAM 3D Pen",
    theme: "maker",
    job: "3D 전문가",
    tagline: "3D Pen으로 역사를 배우자! 3D 히스토리",
    formats: both,
    outline: ["4차 산업혁명을 알아보다!", "3D Pen을 활용한 메이커의 시작", "3D Modeling 학습", "3D 프린터를 활용한 나의 미래 찾아보기"],
  },
  {
    slug: "led-acrylic",
    title: "LED 아크릴 무드등 만들기",
    theme: "maker",
    tagline: "분위기 깡패! 아크릴 무드등 만들기",
    formats: both,
    outline: ["LED에 대해 알아보기", "개인 디자인 또는 제시된 디자인 선택", "아크릴 도안 채색 및 각인하기", "개인의 스타일로 무드등 꾸미기", "LED 바로 나만의 무드등 만들기"],
  },
  {
    slug: "laser-engraving",
    title: "레이저 우드 각인 체험",
    theme: "maker",
    tagline: "레이저로 만드는 나만의 공예품",
    formats: both,
    outline: ["레이저 마킹기 사용법 알아보기", "레이저로 나무 및 기타 소재에 나만의 문양 각인해 보기"],
  },
  {
    slug: "sublimation-tile",
    title: "승화전사 포토타일·퍼즐 만들기",
    theme: "maker",
    formats: both,
    outline: ["히트프레스와 전사 프린터로 포토타일·퍼즐 만들기", "승화전사의 원리로 다양한 나만의 디자인 상품 만들어 보기"],
  },
  {
    slug: "custom-mug",
    title: "커스텀 머그컵 만들기",
    theme: "maker",
    tagline: "열과 압력의 마법! 나만의 개성 넘치는 머그컵",
    formats: both,
    outline: ["승화전사 기술의 원리와 과정", "디자인 작업: 개인 디자인 선택 또는 제작", "디자인을 전사용지에 인쇄", "전사 후 머그컵 확인 및 디자인 품질 평가", "완성된 머그컵 세척 방법 및 관리 안내"],
  },

  // ── VR·AR·메타버스 ─────────────────────────────────
  {
    slug: "hologram",
    title: "홀로그램(Hologram)",
    theme: "xr",
    job: "홀로그램 전문가",
    tagline: "현실 같은 가상! 홀로그램 만들기",
    formats: both,
    outline: ["4차 산업혁명을 알아보다!", "홀로그램이란?", "홀로그램의 원리 및 적용 사례", "홀로그램 프로젝터 만들기", "홀로그램 영상 만들기, 홀로그램 체험", "3D 입체 영상 감상하기 (문화재, 유튜브 영상 등)"],
  },
  {
    slug: "vr-vive",
    title: "가상현실 프로젝트(VR/VIVE)",
    theme: "xr",
    job: "가상현실(VR) 전문가",
    tagline: "우리 시대의 새로운 공간 가상현실(VR)",
    formats: both,
    outline: ["4차 산업혁명을 알아보다!", "가상현실(VR)과 증강현실(AR)에 대해 알아보기", "VR 기기로 롤러코스터·해저 탐험 등 가상현실 체험", "VIVE·Oculus를 이용한 가상현실 체험"],
  },
  {
    slug: "vr-cardboard",
    title: "가상현실(VR) 카드보드",
    theme: "xr",
    job: "가상현실(VR) 전문가",
    formats: both,
    outline: ["4차 산업혁명을 알아보다!", "가상현실(VR)과 증강현실(AR)에 대해 알아보기", "가상현실을 활용한 콘텐츠 알아보기", "구글 카드보드 만들기", "내 휴대폰으로 가상현실 사진 찍기", "가상현실 체험"],
  },
  {
    slug: "ar",
    title: "증강현실(AR)",
    theme: "xr",
    job: "증강현실(AR) 전문가",
    tagline: "증강현실로 만나는 생생한 게임의 세계",
    formats: both,
    outline: ["4차 산업혁명을 알아보다!", "증강현실(AR)에 대해 알아보기", "큐브박스 만들기", "큐브박스를 활용한 증강현실 체험"],
  },
  {
    slug: "science-level-up",
    title: "Science Level Up",
    theme: "xr",
    formats: both,
    outline: ["4차 산업혁명을 알아보다!", "과학과 가상·증강현실을 융합한 프로그램", "스마트폰으로 과학 현상을 증강현실로 확인하기"],
  },
  {
    slug: "vr-360",
    title: "VR 360도 영상 제작",
    theme: "xr",
    tagline: "VR 속에 나만의 세상을 담다!",
    formats: both,
    outline: ["유튜브 등 미디어 플랫폼의 360도 영상 제작 과정 알아보기", "학교 풍경을 360도 카메라로 촬영해 나만의 VR 콘텐츠 제작"],
  },
  {
    slug: "metaverse",
    title: "메타버스(Metaverse) 체험 및 활용",
    theme: "xr",
    job: "메타버스 전문가",
    tagline: "가상공간에서 만나는 새로운 세계로의 탐험!",
    formats: both,
    outline: ["메타버스란?", "메타버스 시대의 새로운 화상회의 플랫폼 게더타운 체험", "레이싱 경기 및 O/X 문제 풀기 등"],
  },
  {
    slug: "vr-metaverse-coding",
    title: "VR 메타버스 코딩",
    theme: "xr",
    tagline: "스스로 만들어 보는 VR 메타버스 코딩",
    formats: both,
    outline: ["메타버스·AI 및 4차 산업혁명 기술 체험 교육", "가상현실에 코딩 접목하기", "메타버스 VR/AR 콘텐츠 만들기"],
  },

  // ── 로봇·스마트팜 ───────────────────────────────────
  {
    slug: "robot-coordinator",
    title: "로봇 코디네이터",
    theme: "robot-smartfarm",
    job: "로봇공학자",
    formats: both,
    outline: ["4차 산업혁명을 알아보다!", "로봇 기초 교육 (부품, 사용법 등)", "배틀 로봇 제작 및 개인·팀별 로봇 대회", "체험용 로봇으로 미니게임하기", "로봇을 활용한 나의 미래 찾아보기"],
  },
  {
    slug: "smart-farm",
    title: "스마트팜",
    theme: "robot-smartfarm",
    job: "스마트팜 전문가",
    formats: both,
    outline: ["6차 산업혁명을 알아보다!", "스마트팜 확산과 발전 방향", "스마트팜 기술 활용 실습 (아두이노 키트)"],
  },

  // ── 백제문화유산 ───────────────────────────────────
  {
    slug: "baekje-hanji-lamp",
    title: "백제문양 LED 한지등 만들기",
    theme: "baekje",
    tagline: "우아하고 세련된 백제문양 LED 한지등",
    formats: both,
    outline: ["유네스코 세계유산 백제역사유적지구에 대해 알기", "공주·부여·익산 지역 문화재 만나기", "백제 역사 속에 숨어 있는 문양 찾기", "백제문양 LED 한지등 만들기"],
  },
  {
    slug: "string-art",
    title: "스트링 아트(String Art)",
    theme: "baekje",
    tagline: "직선과 규칙의 아름다운 만남!",
    formats: both,
    outline: ["수학의 '규칙성' 영역 알기", "규칙성을 활용한 스트링아트 학습", "백제 역사 속 문양을 이용한 스트링아트 작품 만들기", "자신만의 창의적 표현하기"],
  },
  {
    slug: "baekje-led-dice",
    title: "백제문양 LED 주사위 만들기",
    theme: "baekje",
    tagline: "정육면체의 비밀",
    formats: expOnly,
    outline: ["유네스코 세계유산 백제역사유적지구에 대해 알기", "백제 역사 속에 숨어 있는 문양 찾기", "백제문양 LED 주사위 만들기 (5cm × 5cm × 5cm)", "역사유적지와 문화재 탐방 주사위 놀이"],
  },
  {
    slug: "wind-chime",
    title: "나무 풍경 만들기",
    theme: "baekje",
    tagline: "바람 불면 귀가 쫑긋! 내 방 안의 인테리어 소품",
    formats: expOnly,
    outline: ["유네스코 세계유산 백제역사유적지구에 대해 알기", "백제 역사 속에 숨어 있는 문양 찾기", "백제 문양을 이용한 풍경 만들기", "소리로 듣는 풍경, 눈으로 보는 백제시대의 예술성"],
  },
  {
    slug: "toktok-block",
    title: "백제문양 톡톡블록 만들기",
    theme: "baekje",
    tagline: "톡톡블록으로 만드는 백제역사 문화재 복원",
    formats: expOnly,
    outline: ["톡톡블록을 이용한 캐릭터 만들기", "백제 역사 속 문화재를 알아보고 톡톡블록으로 복원(만들기)"],
  },
  {
    slug: "history-cube",
    title: "역사 큐브 시리즈",
    theme: "baekje",
    tagline: "큐브 속 숨어 있는 문화재! 백제역사큐브 만들기",
    formats: expOnly,
    outline: ["백제역사유적지구에 대해 알기", "부여·공주·익산 큐브 중 택1", "큐브로 만드는 백제역사유적지구", "스티커로 큐브를 구성하고 큐브 만들기"],
  },
  {
    slug: "k-heritage-led",
    title: "K-헤리티지 LED 무드등 만들기",
    theme: "baekje",
    tagline: "우아하고 세련된 K-헤리티지 LED 무드등",
    formats: both,
    outline: ["역사와 유적지구에 대해 알기", "경주·전주·공주·부여·익산 중 선택1", "역사 속에 숨어 있는 문양 찾기", "K-헤리티지 LED등을 창의적으로 꾸미고 감상하기"],
  },
  {
    slug: "mini-folding-screen",
    title: "백제 미니 병풍 만들기",
    theme: "baekje",
    tagline: "스토리텔링으로 만들어 보는 역사!",
    formats: both,
    outline: ["역사 속 문화재와 그 속에 숨어 있는 스토리텔링 알아보기", "부여·공주·익산 지역 병풍 중 선택1", "각 지역 문화재에 대해 알아보기"],
  },
  {
    slug: "baekje-tangram",
    title: "백제 칠교 놀이",
    theme: "baekje",
    tagline: "놀며 만드는 칠교",
    formats: both,
    outline: ["백제역사유적지구에 대해 알기", "공주·부여·익산 지역 문화재로 만들어 보는 칠교"],
  },
  {
    slug: "muwang-automata",
    title: "백제 무왕 오토마타 만들기",
    theme: "baekje",
    tagline: "스스로 움직이는 기계",
    formats: both,
    outline: ["오토마타의 기원과 원리에 대해 알기", "과학(기술)의 원리와 역사적 상상력이 결합된 오토마타 만들기", "지역 문화재로 만들어 보는 오토마타"],
  },
  {
    slug: "mireuksa-puzzle",
    title: "미륵사지 입체퍼즐",
    theme: "baekje",
    tagline: "미륵사지 이야기: 내 손으로 만드는 미륵사지",
    formats: both,
    outline: ["백제역사유적지구에 대해 알기", "미륵사지 스토리텔링", "지역 문화재(미륵사지)로 입체퍼즐 만들기"],
  },
  {
    slug: "ssangneung-puzzle",
    title: "익산 쌍릉 입체퍼즐",
    theme: "baekje",
    tagline: "스토리텔링으로 풀어 보는 백제 무왕",
    formats: both,
    outline: ["서동왕자와 선화공주 이야기", "백제 무왕 스토리텔링", "지역 문화재(쌍릉)로 입체퍼즐 만들기"],
  },

  // ── 공예·아트 ───────────────────────────────────────
  {
    slug: "hanji-craft",
    title: "한지공예",
    theme: "craft",
    job: "한지공예 전문가",
    tagline: "전통공예 기법으로 만드는 한지공예품",
    formats: both,
    outline: ["전통공예 소개 및 한지란?", "통영 12공방의 역사", "한지의 기법 알아보기", "한지와 문양으로 작품 완성하기", "일상에서의 다양한 공예품"],
  },
  {
    slug: "leather-craft",
    title: "가죽공예",
    theme: "craft",
    job: "가죽공예 전문가",
    tagline: "소품을 만드는 토탈아트",
    formats: both,
    outline: ["가죽의 성질과 다룰 때 조심할 점", "다양한 가죽 제품", "바느질의 종류와 유의할 점", "가죽 필통·수첩·티슈케이스 만들기"],
  },
  {
    slug: "napkin-art",
    title: "냅킨공예",
    theme: "craft",
    tagline: "소품을 만드는 토탈아트",
    formats: both,
    outline: ["냅킨아트의 이해: 냅킨의 그림을 골라 원하는 소품에 붙이는 아트", "냅킨아트 체험: 나만의 귀여운 캐릭터 소품 만들기"],
  },
  {
    slug: "ribbon-craft",
    title: "리본공예",
    theme: "craft",
    tagline: "소품을 만드는 토탈아트",
    formats: both,
    outline: ["일상에서 만나는 공예품 소개", "다양한 공예 분야 소개", "공예가에 대한 이해", "나만의 리본 작품 만들기"],
  },
  {
    slug: "macrame",
    title: "매듭공예(마크라메)",
    theme: "craft",
    tagline: "마크라메(매듭아트) 소품 만들기",
    formats: both,
    outline: ["마크라메의 역사와 배경", "실생활 속 공예가 활동", "마크라메 소품 만들기", "머리매듭과 평매듭 배우기"],
  },
  {
    slug: "minhwa",
    title: "민화작가",
    theme: "craft",
    tagline: "내 꿈은 민화작가",
    formats: both,
    outline: ["민화의 역사를 들으며 의미 생각하기", "민화의 특징과 표현 방식 소개", "좋아하는 민화 그림과 상징 감상하기", "나도 민화작가 (에코백 만들기)"],
  },
  {
    slug: "total-craft",
    title: "토탈공예",
    theme: "craft",
    tagline: "손끝으로 여는 토탈공예 세상",
    formats: both,
    outline: ["공예가의 다양한 분야와 사례 소개", "실생활 속 공예가 활동", "공예 활동으로 자신의 흥미 파악", "토탈공예 실습"],
  },
  {
    slug: "pop-art",
    title: "팝아트",
    theme: "craft",
    tagline: "나도 팝아트 작가",
    formats: both,
    outline: ["팝아트란 무엇인가?", "유명한 팝아트 작가와 대표작 알아보기", "팝아트 기법으로 직접 그려 작품 완성"],
  },
  {
    slug: "fancy-wood",
    title: "팬시우드",
    theme: "craft",
    tagline: "Color와 우드의 만남, 우드아트",
    formats: both,
    outline: ["우드아트 이야기", "우드아트 배우기", "우드 작품 만들기 (선화공주·서동왕자·손거울·저금통 등 선택)"],
  },
  {
    slug: "terrarium",
    title: "테라리움 미니 생태계",
    theme: "craft",
    tagline: "동물 피규어가 있는 힐링 숲!",
    formats: both,
    outline: ["자연을 담아내는 힐링 테라리움 만들기", "직접 꾸미며 나만의 디자인 완성", "자연 친화적인 이끼로 작은 정원 꾸미기", "심리적 안정과 정서에 도움이 되는 미니 생태계"],
  },
  {
    slug: "christmas-wreath",
    title: "크리스마스 리스 만들기",
    theme: "craft",
    tagline: "크리스마스 공예공작소!",
    formats: both,
    outline: ["만들고 싶은 리스의 분위기와 색상 구상", "크리스마스 분위기의 나만의 리스 만들기", "다채로운 재료로 개성 가득한 디자인 완성"],
  },
  {
    slug: "najeon-keyring",
    title: "전통공예 — 자개 갓 키링 만들기",
    theme: "craft",
    tagline: "영롱하게 빛나는 자개를 활용한 K-갓 키링",
    formats: both,
    outline: ["전통과 현대의 아름다움을 키링에 표현", "영롱한 자개와 갓 모티브를 활용한 공예 체험", "전통과 현대 감각이 조화된 키링 디자인·제작", "자개 조각을 섬세하게 장식해 세상에 하나뿐인 갓 키링 완성"],
  },
  {
    slug: "moru-tree-card",
    title: "모루 트리 카드 만들기",
    theme: "craft",
    tagline: "크리스마스 공예공작소!",
    formats: both,
    outline: ["공예 전문가 직업 탐색", "모루의 기본 기법 시연", "안전 수칙 및 주의사항 안내", "모루로 기본 모양 만들기", "모루로 트리 모양을 만들고 카드 꾸미기"],
  },
  {
    slug: "paper-folding",
    title: "종이접기지도사",
    theme: "craft",
    job: "종이접기지도사",
    tagline: "오늘도 재밌는 뇌 운동! 페이퍼 크래프트",
    formats: both,
    outline: ["종이접기지도사 직업 탐색", "종이접기의 역사와 기초 이론", "기본 접기 방법과 다양한 종이접기 기법", "색종이로 만드는 작품 여행", "다양한 색상·패턴의 종이로 작품 만들기"],
  },
  {
    slug: "balloon-art",
    title: "풍선아티스트",
    theme: "craft",
    job: "풍선아티스트",
    tagline: "나도 풍선아티스트! 행복을 전하는 풍선아트",
    formats: both,
    outline: ["풍선아티스트 직업 탐색", "창의력과 손재주를 기르는 풍선아트 소개", "풍선의 종류와 특성", "기본 매듭법과 공기 주입 방법", "간단한 동물·꽃·장식품 만들기", "학생 작품 전시"],
  },
  { slug: "stained-glass", title: "스테인글라스", theme: "craft", outline: [] },
  { slug: "candle-art", title: "캔들아트", theme: "craft", outline: [] },
  { slug: "soap-craft", title: "비누공예", theme: "craft", outline: [] },
  { slug: "florist", title: "플로리스트", theme: "craft", job: "플로리스트", outline: [] },

  // ── 직업탐색·진로 ───────────────────────────────────
  {
    slug: "career-counseling",
    title: "꿈과 행복을 찾는 진로상담",
    theme: "jobs",
    tagline: "꿈을 찾고 행복 찾는 진로상담",
    formats: both,
    outline: ["자기 이해를 바탕으로 적성과 능력에 맞는 진로를 능동적으로 탐색", "다양한 일과 직업에 대한 올바른 개념 정립", "진로 흥미 탐색 검사 (홀랜드 검사·진로 고민 영역 검사·학습 고민 영역 검사)"],
  },
  {
    slug: "media-creator",
    title: "미디어 콘텐츠 크리에이터",
    theme: "jobs",
    job: "영상 미디어 큐레이터",
    tagline: "영상 미디어 편집",
    formats: both,
    outline: ["4차 산업혁명 시대", "영상 촬영하기", "영상 편집 앱 설치 및 편집 기술", "개인 SNS 및 유튜브 업로드", "미리 준비하는 미래 직업, 진로 탐색"],
  },
  {
    slug: "perfumer",
    title: "조향사",
    theme: "jobs",
    job: "조향사",
    tagline: "향기의 매력, 향기로운 공기 마술사",
    formats: both,
    outline: ["조향사의 직업 이해", "향기의 중요성과 역할", "천연 향료와 합성 향료의 차이, 다양한 향료의 특징과 사용 예시", "향기 노트 작성: 향료의 향기와 연상되는 이미지 기록", "향료를 조합해 나만의 향수 만들기"],
  },
  {
    slug: "chocolatier",
    title: "초콜릿 만들기(쇼콜라티에)",
    theme: "jobs",
    job: "쇼콜라티에",
    tagline: "큐티 초코 프레첼! 초콜릿 만들기",
    formats: both,
    outline: [],
  },
  {
    slug: "nail-art",
    title: "네일아티스트",
    theme: "jobs",
    job: "네일아티스트",
    formats: both,
    outline: ["위생적인 손톱 관리법과 건강한 손톱의 중요성", "다양한 네일 도구와 재료로 개성 있는 디자인 표현", "섬세한 손 기술과 미적 감각, 예술적 창의력 기르기", "서로의 작품을 감상하며 아름다움을 나누는 즐거움"],
  },
  { slug: "barista", title: "바리스타", theme: "jobs", job: "바리스타", outline: [] },
  { slug: "baking", title: "제과제빵", theme: "jobs", job: "제과제빵사", outline: [] },
  { slug: "makeup-artist", title: "메이크업 아티스트", theme: "jobs", job: "메이크업 아티스트", outline: [] },
  { slug: "special-makeup", title: "특수분장사", theme: "jobs", job: "특수분장사", outline: [] },
  { slug: "webtoon", title: "웹툰 작가", theme: "jobs", job: "웹툰 작가", outline: [] },
  { slug: "forensic", title: "범죄과학수사", theme: "jobs", job: "과학수사관", outline: [] },
  { slug: "horticultural-therapy", title: "원예치료사", theme: "jobs", job: "원예치료사", outline: [] },
  { slug: "animal-assisted", title: "반려동물과 함께하는 동물매개활동가", theme: "jobs", job: "동물매개활동가", outline: [] },
  { slug: "environment", title: "환경전문가", theme: "jobs", job: "환경전문가", outline: [] },
  { slug: "art-therapy", title: "미술심리치료사", theme: "jobs", job: "미술심리치료사", outline: [] },
  { slug: "music-therapy", title: "음악치료사", theme: "jobs", job: "음악치료사", outline: [] },

  // ── 과학 ────────────────────────────────────────────
  {
    slug: "science-1",
    title: "Science 체험 Ⅰ",
    theme: "science",
    formats: both,
    outline: ["과학 체험학습: 관련 기초 이론", "과학 체험: 만들기 및 놀이", "학년·학급·학교별 수준에 맞는 체험으로 협의 진행"],
  },
  {
    slug: "science-2",
    title: "Science 체험 Ⅱ",
    theme: "science",
    formats: both,
    outline: ["과학 체험학습: 관련 기초 이론", "과학 체험: 만들기 및 놀이", "학년·학급·학교별 수준에 맞는 체험으로 협의 진행"],
  },
  { slug: "science-earth", title: "과학 — 지구과학", theme: "science", outline: [] },
  { slug: "science-chemistry", title: "과학 — 화학", theme: "science", outline: [] },
  { slug: "science-physics", title: "과학 — 물리", theme: "science", outline: [] },
  { slug: "science-biology", title: "과학 — 생물", theme: "science", outline: [] },
];

export const getTheme = (slug: string) => careerThemes.find((t) => t.slug === slug);
export const programsByTheme = (slug: CareerThemeSlug) => careerPrograms.filter((p) => p.theme === slug);
export const getCareerProgram = (slug: string) => careerPrograms.find((p) => p.slug === slug);
export const careerProgramSlugs = new Set(careerPrograms.map((p) => p.slug));

/** 프로그램 사진: leadPhotos + cp-<slug>, cp-<slug>-2 … (import-photos 가 만든 순서) */
export function programPhotos(p: CareerProgram): PhotoName[] {
  const names = Object.keys(photos) as PhotoName[];
  const own = names
    .filter((n) => n === `cp-${p.slug}` || new RegExp(`^cp-${p.slug.replace(/[-]/g, "\\-")}-\\d+$`).test(n))
    .sort((a, b) => a.length - b.length || a.localeCompare(b));
  return [...(p.leadPhotos ?? []), ...own];
}

/** 프로그램 앵커 링크 */
export const careerProgramHref = (p: CareerProgram) => `/career/${p.theme}#${p.slug}`;
