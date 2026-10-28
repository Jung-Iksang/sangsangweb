/**
 * 진로·직업체험 콘텐츠 — 출처: 기업소개 PDF 18~20쪽(4차산업 진로체험 스쿨), 5·9·12쪽(인증·교육기부)
 * 메인 CareerSection 과 /career, /experience/school 에서 공용
 */
import type { PhotoName } from "./photos.generated";

export type CareerSchool = {
  no: string;
  name: string;
  tech: string;
  tagline: string;
  desc: string;
  tags: string[];
  color: string;
};

/** "세상을 바꾸는 미래기술 1~6" — 6개 진로체험 스쿨 (PDF 원문) */
export const careerSchools: CareerSchool[] = [
  {
    no: "01",
    name: "드론 스쿨",
    tech: "Drone",
    tagline: "멀티플레이어, 드론",
    desc: "드론의 대중화가 대두됨에 따라 산업에서의 드론의 역할과 활용방안, 비행 체험, 드론분야 미래직업을 배우는 드론메이커 교육",
    tags: ["드론메이커", "비행체험", "드론창작"],
    color: "#1f9bd7",
  },
  {
    no: "02",
    name: "3D프린터 스쿨",
    tech: "3D Printer",
    tagline: "3차원 제품 프린팅",
    desc: "3D 프린팅의 설계와 출력을 통해 창작 욕구를 실현하고 상상을 현실로 만들어 보는 창의 메이커 교육",
    tags: ["3D펜", "3D모델링", "3D창작"],
    color: "#f5b800",
  },
  {
    no: "03",
    name: "코딩 스쿨",
    tech: "Coding",
    tagline: "기계와 사람을 잇는 언어",
    desc: "4차산업혁명시대의 핵심역량인 SW기술과 컴퓨팅사고력을 배우고 SW가 바꿀 수 있는 미래세상을 창작해 보는 융합코딩 교육",
    tags: ["언플러그드", "스크래치", "알고리즘", "AI", "아두이노"],
    color: "#7abd47",
  },
  {
    no: "04",
    name: "VR/AR 스쿨",
    tech: "VR / AR",
    tagline: "현실과 가상이 만나는 증강현실",
    desc: "실감 미디어 시대를 이끄는 VR(가상현실), AR(증강현실), MR(융합현실)의 원리와 기술을 체험하고 습득하는 상상메이커 교육",
    tags: ["가상현실", "코스페이스", "360카메라", "VR창작"],
    color: "#e66ba2",
  },
  {
    no: "05",
    name: "로봇 스쿨",
    tech: "Robot",
    tagline: "사람들의 해결사, 로봇",
    desc: "무인시대가 대두됨에 따라 4차 산업혁명시대 로봇의 역할과 중요성을 알아보고, 실제 작동 설계와 제작과정을 체험하는 로봇 메이커 교육",
    tags: ["인공지능로봇", "스마트토이", "휴머노이드", "HW+SW"],
    color: "#6b4fc2",
  },
  {
    no: "06",
    name: "IoT 스쿨",
    tech: "IoT",
    tagline: "사물인터넷 세상",
    desc: "우리의 삶에 많은 부분을 차지하고 있는 사물인터넷의 원리를 알아보고 창의적 아이디어를 통해 IoT 제품을 제작하는 융합메이커 교육",
    tags: ["홈IoT", "스마트농장", "스마트공장", "센서활용"],
    color: "#d64550",
  },
];

/** 메인·진로 페이지 사진 카드 */
export const careerCards: { title: string; desc: string; photo: PhotoName; href: string }[] = [
  { title: "로봇·코딩 체험", desc: "로봇 설계와 코딩으로 배우는 메이커 교육", photo: "career-robot", href: "/experience/school" },
  { title: "드론 교실", desc: "비행 체험과 드론축구로 만나는 항공과학", photo: "drone-class", href: "/experience/drone-soccer" },
  { title: "창업·진로 멘토링", desc: "전북창업체험지원센터 운영 경험의 창업 체험", photo: "career-startup", href: "/career" },
  { title: "3D·메이커 교실", desc: "3D펜·3D프린터로 상상을 현실로", photo: "career-maker", href: "/education/afterschool" },
];

/** 교육기부 진로체험 — 인증·활동 (PDF 9·12·13쪽, 41쪽) */
export const careerCredentials = [
  { title: "교육부 교육기부 진로체험 인증기관", desc: "2020년 재인증, 현 인증기간 2023.7.5 ~ 2026.7.4", photo: "cert-moe" as PhotoName },
  { title: "익산시 우수 진로체험기관", desc: "익산시 · 익산교육지원청 선정 (2018.12 ~ 2021.12)", photo: "cert-iksan" as PhotoName },
  { title: "개인교육기부단 운영", desc: "한국과학창의재단 · 전라북도교육청 (2020년부터 매년)", photo: "career-mentoring" as PhotoName },
  { title: "전북창업체험지원센터 위탁운영", desc: "전라북도교육청 '4차산업혁명시대 창업체험 길라잡이' (2019)", photo: "career-startup" as PhotoName },
];
