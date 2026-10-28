/** 사이트 공통 정보 — 연락처·주소가 바뀌면 이 파일만 수정 */
export const site = {
  name: "상상마루",
  nameEn: "Sangsangmaru",
  legalName: "유한회사 상상마루",
  title: "상상마루 - 진로·직업체험 교육 플랫폼",
  description:
    "상상마루는 전북 익산의 진로·직업체험 교육 전문기관입니다. 방과후·늘봄교육, 자유학년제, SW·AI 교육, 드론축구, 창의적체험활동, 교육기부 진로체험 프로그램을 운영합니다.",
  keywords: [
    "상상마루",
    "진로체험",
    "직업체험",
    "진로교육",
    "익산 진로체험",
    "전북 진로체험",
    "늘봄교육",
    "방과후교육",
    "자유학년제",
    "SW교육",
    "AI교육",
    "드론축구",
    "창의적체험활동",
    "교육기부",
    "진로진학체험지원센터",
  ],
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://imaginemaru.kr").replace(/\/$/, ""),
  locale: "ko_KR",
  foundingYear: 2020,
  contact: {
    phone: "1544-0634",
    fax: "0505-200-6060",
    email: "cybercops@wku.ac.kr",
  },
  address: {
    full: "전북특별자치도 익산시 익산대로 460 원광대학교 프라임관",
    region: "전북특별자치도",
    locality: "익산시",
    street: "익산대로 460 원광대학교 프라임관",
    postalCode: "54538",
  },
  business: {
    ceo: "조진욱",
    registrationNo: "651-86-01854",
    center: "진로진학체험지원센터",
  },
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
