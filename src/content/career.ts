/**
 * 진로체험기관 인증·교육기부 활동 — 출처: 2024 기업소개 PDF 5·9·12·13·41쪽
 * 진로·직업체험 프로그램 목록은 ./career-programs.ts (2026 운영계획 PDF)
 */
import type { PhotoName } from "./photos.generated";

export const careerCredentials: { title: string; desc: string; photo: PhotoName }[] = [
  { title: "교육부 교육기부 진로체험 인증기관", desc: "2020년 재인증, 현 인증기간 2023.7.5 ~ 2026.7.4", photo: "cert-moe" },
  { title: "익산시 우수 진로체험기관", desc: "익산시 · 익산교육지원청 선정 (2018.12 ~ 2021.12)", photo: "cert-iksan" },
  { title: "개인교육기부단 운영", desc: "한국과학창의재단 · 전라북도교육청 (2020년부터 매년)", photo: "career-mentoring" },
  { title: "전북창업체험지원센터 위탁운영", desc: "전라북도교육청 '4차산업혁명시대 창업체험 길라잡이' (2019)", photo: "career-startup" },
];
