/**
 * 교육활동·체험활동 프로그램 콘텐츠.
 * 기존 사이트(old/pages/education, old/pages/experience) 문구를 이식했습니다.
 * 문의 전화·이메일은 src/config/site.ts 값을 사용합니다.
 */
export type ProgramCategory = "education" | "experience";

export type Program = {
  slug: string;
  category: ProgramCategory;
  title: string;
  /** 검색 결과·카드에 쓰이는 한 줄 요약 (120자 안팎) */
  summary: string;
  intro: string[];
  featuresTitle?: string;
  features: string[];
  targets: string[];
  /** 활동 분야·커리큘럼 등 (선택) */
  detailsTitle?: string;
  details?: { label: string; value: string }[];
  scheduleTitle?: string;
  schedule: { label: string; value: string }[];
  ctaLabel: string;
  image: string;
  keywords: string[];
};

export const categoryLabel: Record<ProgramCategory, string> = {
  education: "교육활동",
  experience: "체험활동",
};

export const programs: Program[] = [
  {
    slug: "afterschool",
    category: "education",
    title: "방과후/늘봄 교육",
    summary:
      "정규 수업 이후 다양한 활동으로 학생의 잠재력을 발견하는 방과후·늘봄 교육 프로그램. 전문 강사진의 실습 중심 맞춤형 수업을 운영합니다.",
    intro: [
      "방과후/늘봄 교육 프로그램은 학생들이 정규 수업 이후에도 다양한 활동을 통해 자신의 잠재력을 발견하고 성장할 수 있도록 지원합니다.",
    ],
    features: [
      "전문 강사진의 체계적인 교육 진행",
      "학생 맞춤형 프로그램 구성",
      "실습 중심의 참여형 수업",
      "안전한 교육 환경 제공",
    ],
    targets: ["초등학생", "중학생", "고등학생"],
    schedule: [
      { label: "운영 기간", value: "학기 중 상시 운영" },
      { label: "수업 시간", value: "방과 후 14:00 ~ 18:00" },
    ],
    ctaLabel: "프로그램 신청 문의",
    image: "/mock/program-afterschool.svg",
    keywords: ["방과후교육", "늘봄교육", "늘봄학교", "익산 방과후"],
  },
  {
    slug: "outside",
    category: "education",
    title: "학교밖 늘봄교육",
    summary:
      "학교 울타리를 넘어 지역사회와 함께하는 학교밖 늘봄교육. 직업 현장 방문과 체험으로 사회성과 진로 탐색 역량을 키웁니다.",
    intro: [
      "학교밖 늘봄교육은 학교 울타리를 넘어 지역사회와 함께하는 교육 프로그램입니다.",
      "다양한 현장 체험과 실습을 통해 학생들의 사회성과 실무 능력을 키워줍니다.",
    ],
    features: [
      "지역사회 연계 현장 체험 프로그램",
      "다양한 직업 현장 방문 및 체험",
      "사회성 및 협동심 향상 활동",
      "진로 탐색 기회 제공",
    ],
    targets: ["초등학생", "중학생"],
    schedule: [
      { label: "운영 기간", value: "학기 중 및 방학 중" },
      { label: "활동 시간", value: "프로그램별 상이" },
    ],
    ctaLabel: "프로그램 신청 문의",
    image: "/mock/program-outside.svg",
    keywords: ["학교밖 늘봄", "지역연계 체험", "현장체험학습"],
  },
  {
    slug: "freeyear",
    category: "education",
    title: "자유학년(기)제",
    summary:
      "중학교 자유학년(기)제 연계 진로 탐색·직업 체험 프로그램. 시험 부담 없이 꿈과 끼를 찾고 진로 포트폴리오 작성을 지원합니다.",
    intro: [
      "자유학년(기)제 프로그램은 중학교 자유학년제와 연계하여 학생들이 다양한 진로 탐색과 직업 체험을 할 수 있도록 지원합니다.",
      "시험 부담 없이 자신의 꿈과 끼를 찾아가는 시간입니다.",
    ],
    features: [
      "자유학년제 연계 진로 탐색 활동",
      "다양한 직업군 체험 프로그램",
      "자기주도적 학습 능력 향상",
      "진로 포트폴리오 작성 지원",
    ],
    targets: ["중학교 1학년", "자유학기제 참여 학교"],
    schedule: [
      { label: "운영 기간", value: "1학기 / 2학기 (학교별 협의)" },
      { label: "활동 시간", value: "학교 정규 수업 시간" },
    ],
    ctaLabel: "프로그램 신청 문의",
    image: "/mock/program-freeyear.svg",
    keywords: ["자유학년제", "자유학기제", "중학교 진로체험", "진로탐색"],
  },
  {
    slug: "drone",
    category: "education",
    title: "탑마루드론축구단",
    summary:
      "드론 기술과 축구를 결합한 탑마루드론축구단. 드론 조종 교육과 팀 경기로 창의성·협동심을 키우고 대회 참가 기회를 제공합니다.",
    intro: [
      "탑마루드론축구단은 드론 기술과 축구를 결합한 새로운 형태의 스포츠 교육 프로그램입니다.",
      "첨단 기술을 활용한 스포츠 활동을 통해 학생들의 창의성과 협동심을 키워줍니다.",
    ],
    features: [
      "드론 조종 기술 교육",
      "팀워크와 전략적 사고력 향상",
      "첨단 기술과 스포츠의 융합",
      "대회 참가 기회 제공",
    ],
    targets: ["초등학생", "중학생", "고등학생"],
    schedule: [
      { label: "훈련 일정", value: "주 2회 (토요일, 일요일)" },
      { label: "훈련 시간", value: "14:00 ~ 17:00" },
    ],
    ctaLabel: "단원 모집 문의",
    image: "/mock/program-drone.svg",
    keywords: ["드론축구", "드론교육", "익산 드론축구단", "드론 체험"],
  },
  {
    slug: "hrd",
    category: "education",
    title: "HRD-Net강사양성과정",
    summary:
      "고용노동부 HRD-Net 등록 강사양성과정. 교수 설계·강의 기법·평가 방법을 배우는 40시간(5일) 실무 과정으로 수료 후 강사 활동을 연계합니다.",
    intro: [
      "HRD-Net 강사양성과정은 전문 강사를 양성하기 위한 체계적인 교육 프로그램입니다.",
      "고용노동부 HRD-Net 등록을 통해 공인된 자격을 취득할 수 있습니다.",
    ],
    features: [
      "고용노동부 HRD-Net 등록 교육과정",
      "전문 강사 자격 취득 지원",
      "실무 중심의 강의 기법 훈련",
      "수료 후 강사 활동 연계",
    ],
    targets: ["강사 희망자", "현직 교사", "직업훈련 관련자"],
    scheduleTitle: "교육 내용",
    schedule: [
      { label: "교육 기간", value: "총 40시간 (5일 과정)" },
      { label: "교육 내용", value: "교수 설계, 강의 기법, 평가 방법 등" },
      { label: "수료 조건", value: "출석률 80% 이상, 평가 70점 이상" },
    ],
    ctaLabel: "교육 신청 문의",
    image: "/mock/program-hrd.svg",
    keywords: ["HRD-Net", "강사양성과정", "직업훈련", "강사 자격"],
  },
  {
    slug: "volunteer",
    category: "education",
    title: "교육기부 진로체험",
    summary:
      "각 분야 현직 전문가의 재능기부로 진행하는 교육기부 진로체험. IT·의료·문화예술 등 생생한 직업 세계를 멘토링으로 소개합니다.",
    intro: [
      "교육기부 진로체험은 각 분야의 전문가들이 재능기부를 통해 학생들에게 생생한 직업 세계를 소개하는 프로그램입니다.",
      "현장 전문가의 이야기를 통해 학생들은 다양한 직업에 대한 이해를 높일 수 있습니다.",
    ],
    features: [
      "현직 전문가의 직접 강의 및 멘토링",
      "다양한 직업군의 실제 업무 소개",
      "진로 상담 및 질의응답 시간",
      "직업 현장 견학 기회 제공",
    ],
    targets: ["초등학생", "중학생", "고등학생"],
    detailsTitle: "참여 분야",
    details: [
      { label: "IT/과학", value: "프로그래머, 데이터분석가, 연구원 등" },
      { label: "의료/보건", value: "의사, 간호사, 약사 등" },
      { label: "문화/예술", value: "디자이너, 작가, 아티스트 등" },
      { label: "기타", value: "요리사, 건축가, 변호사 등 다양한 분야" },
    ],
    schedule: [],
    ctaLabel: "프로그램 신청 문의",
    image: "/mock/program-volunteer.svg",
    keywords: ["교육기부", "진로멘토링", "직업인 특강", "진로체험"],
  },
  {
    slug: "creative",
    category: "experience",
    title: "창의적체험활동",
    summary:
      "메이커·과학 실험·예술 창작을 직접 해보는 창의적체험활동. 3D 프린팅, 아두이노, 로봇 만들기 등 실습으로 창의적 문제해결력을 키웁니다.",
    intro: [
      "창의적체험활동은 학생들의 창의성과 문제해결능력을 키우는 다양한 체험 프로그램입니다.",
      "직접 만들고, 실험하고, 탐구하는 활동을 통해 창의적 사고력을 향상시킵니다.",
    ],
    features: [
      "창의력과 문제해결능력 향상",
      "실습 중심의 체험형 교육",
      "팀 프로젝트를 통한 협동심 배양",
      "다양한 분야의 융합형 활동",
    ],
    targets: ["초등학생", "중학생", "고등학생"],
    detailsTitle: "활동 프로그램",
    details: [
      { label: "메이커 활동", value: "3D 프린팅, 아두이노, 로봇 만들기" },
      { label: "과학 실험", value: "화학 실험, 물리 탐구, 생명과학" },
      { label: "예술 창작", value: "디지털 아트, 공예, 미디어 제작" },
    ],
    schedule: [
      { label: "운영 기간", value: "연중 상시 운영" },
      { label: "활동 시간", value: "프로그램별 2~4시간" },
    ],
    ctaLabel: "프로그램 신청 문의",
    image: "/mock/program-creative.svg",
    keywords: ["창의적체험활동", "창체", "메이커교육", "3D프린팅 체험", "아두이노"],
  },
  {
    slug: "swai",
    category: "experience",
    title: "SW.AI교육주간",
    summary:
      "블록코딩부터 인공지능까지 5일간 배우는 SW·AI 교육주간. 알고리즘, 머신러닝 체험, AI 활용 프로젝트 제작과 발표를 진행합니다.",
    intro: [
      "SW.AI교육주간은 소프트웨어와 인공지능에 대한 이해를 높이고, 미래 디지털 사회를 이끌어갈 인재를 양성하기 위한 집중 교육 프로그램입니다.",
      "코딩부터 인공지능까지, 미래 기술을 체험하고 배워보세요!",
    ],
    features: [
      "소프트웨어 코딩 기초부터 심화까지",
      "인공지능(AI) 개념 이해 및 실습",
      "블록코딩, 파이썬 등 다양한 언어 학습",
      "AI 활용 프로젝트 제작",
    ],
    targets: ["초등학생", "중학생", "고등학생"],
    detailsTitle: "교육 내용",
    details: [
      { label: "Day 1-2", value: "SW 기초: 블록코딩, 알고리즘 이해" },
      { label: "Day 3-4", value: "AI 입문: 머신러닝 개념, AI 체험" },
      { label: "Day 5", value: "프로젝트: AI 활용 작품 제작 및 발표" },
    ],
    schedule: [],
    ctaLabel: "프로그램 신청 문의",
    image: "/mock/program-swai.svg",
    keywords: ["SW교육", "AI교육", "코딩교육", "인공지능 체험", "SW교육주간"],
  },
  {
    slug: "science",
    category: "experience",
    title: "과학의날 행사 지원",
    summary:
      "4월 21일 과학의날 학교·지역 과학 축제 지원. 체험 부스 운영, 실험 키트 제공, 전문 강사 파견, 행사 기획 컨설팅까지 제공합니다.",
    intro: [
      "매년 4월 21일 과학의날을 기념하여 학교 및 지역사회와 함께하는 과학 축제 및 체험 행사를 지원합니다.",
      "다양한 과학 실험과 체험 부스를 통해 학생들의 과학적 호기심을 자극합니다.",
    ],
    featuresTitle: "지원 내용",
    features: [
      "과학 체험 부스 운영 지원",
      "과학 실험 키트 및 재료 제공",
      "전문 강사 파견",
      "행사 기획 및 진행 컨설팅",
    ],
    targets: ["초등학교", "중학교", "고등학교", "지역 행사"],
    detailsTitle: "체험 프로그램 예시",
    details: [
      { label: "물리", value: "공기대포 만들기, 정전기 실험, 빛의 굴절" },
      { label: "화학", value: "슬라임 만들기, 화산 폭발 실험, 무지개 탑" },
      { label: "생명과학", value: "현미경 관찰, DNA 추출, 식물 표본" },
      { label: "지구과학", value: "화석 발굴 체험, 암석 관찰, 지진계 만들기" },
    ],
    scheduleTitle: "신청 방법",
    schedule: [
      { label: "신청 기간", value: "행사 1개월 전까지" },
      { label: "신청 방법", value: "전화 또는 이메일 문의" },
    ],
    ctaLabel: "행사 지원 문의",
    image: "/mock/program-science.svg",
    keywords: ["과학의날", "과학축제", "과학체험부스", "과학실험 키트"],
  },
  {
    slug: "culture",
    category: "experience",
    title: "문화예술체험 교육",
    summary:
      "미술·음악·공연·공예·미디어를 직접 체험하는 문화예술 교육. 전문 예술가와 함께하는 창작 활동으로 예술적 감수성을 키웁니다.",
    intro: [
      "문화예술체험 교육은 학생들의 예술적 감수성과 창의력을 키우는 프로그램입니다.",
      "다양한 예술 분야를 직접 체험하며 자신만의 예술 세계를 탐색합니다.",
    ],
    features: [
      "다양한 예술 분야 체험 기회",
      "전문 예술가와 함께하는 실습",
      "창작 활동을 통한 자기 표현",
      "문화 감수성 및 심미적 능력 향상",
    ],
    targets: ["초등학생", "중학생", "고등학생"],
    detailsTitle: "체험 분야",
    details: [
      { label: "미술", value: "회화, 조소, 판화, 디지털 아트" },
      { label: "음악", value: "악기 체험, 작곡, 음악 감상" },
      { label: "공연", value: "연극, 뮤지컬, 무용" },
      { label: "공예", value: "도예, 목공, 섬유공예, 가죽공예" },
      { label: "미디어", value: "영상 제작, 사진, 애니메이션" },
    ],
    schedule: [
      { label: "운영 기간", value: "연중 상시 운영" },
      { label: "활동 시간", value: "프로그램별 2~4시간" },
    ],
    ctaLabel: "프로그램 신청 문의",
    image: "/mock/program-culture.svg",
    keywords: ["문화예술교육", "예술체험", "공예체험", "미디어교육"],
  },
];

export const getProgram = (category: ProgramCategory, slug: string) =>
  programs.find((p) => p.category === category && p.slug === slug);

export const programsBy = (category: ProgramCategory) =>
  programs.filter((p) => p.category === category);
