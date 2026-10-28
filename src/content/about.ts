/** 단체소개 콘텐츠 (기존 old/pages/about 이식) */
export const greeting = {
  lead: "안녕하세요, 상상마루를 방문해 주셔서 감사합니다.",
  body: [
    "상상마루는 학생들의 진로·직업체험 교육을 전문으로 하는 교육 플랫폼입니다.",
    "우리는 학생들이 다양한 직업 세계를 경험하고, 자신의 적성과 흥미를 발견할 수 있도록 체계적인 프로그램을 제공하고 있습니다.",
  ],
  sections: [
    {
      title: "우리의 비전",
      text: "모든 학생들이 꿈을 발견하고 그 꿈을 향해 나아갈 수 있도록 돕는 것이 우리의 비전입니다. 창의적 사고와 실천적 경험을 통해 미래 인재를 양성하는 데 최선을 다하겠습니다.",
    },
    {
      title: "우리의 약속",
      text: "학생 한 명 한 명의 잠재력을 믿고, 그들이 자신만의 길을 찾을 수 있도록 진심 어린 교육을 제공하겠습니다. 앞으로도 변함없이 학생들의 성장을 응원하며 함께 걸어가겠습니다.",
    },
  ],
  closing: "감사합니다.",
  signature: "상상마루 대표",
};

export const history: { year: number; items: string[] }[] = [
  { year: 2025, items: ["상상마루 웹사이트 리뉴얼", "진로·직업체험 프로그램 확대"] },
  {
    year: 2024,
    items: ["HRD-Net 강사양성과정 시작", "탑마루드론축구단 창단", "SW.AI 교육주간 프로그램 런칭"],
  },
  {
    year: 2023,
    items: ["자유학년제 프로그램 확대", "교육기부 진로체험 사업 시작", "문화예술체험 교육 프로그램 개설"],
  },
  { year: 2022, items: ["학교밖 늘봄교육 사업 시작", "창의적체험활동 프로그램 개발"] },
  { year: 2021, items: ["방과후/늘봄 교육 프로그램 시작", "과학의날 행사 지원 사업 참여"] },
  { year: 2020, items: ["상상마루 설립", "진로·직업체험 교육 사업 시작"] },
];

export const transport = [
  { label: "버스", value: "익산시내버스 100번, 200번 원광대학교 정류장 하차" },
  { label: "KTX", value: "익산역 하차 후 택시 약 15분" },
  { label: "자가용", value: "호남고속도로 익산IC → 원광대학교 방면 약 10분" },
];

export const partners = [
  { name: "교육부", src: "/partners/moe.png", width: 400, height: 120 },
  { name: "한국과학창의재단", src: "/partners/kofac.png", width: 428, height: 140 },
  { name: "전북특별자치도", src: "/partners/jeonbuk.png", width: 400, height: 120 },
  { name: "전북특별자치도 익산교육지원청", src: "/partners/iksan-edu.png", width: 400, height: 120 },
  { name: "익산시", src: "/partners/iksan-city.png", width: 400, height: 120 },
  { name: "전북과학문화거점센터", src: "/partners/jb-science-hub.png", width: 594, height: 120 },
];
