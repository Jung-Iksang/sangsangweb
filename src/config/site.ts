/**
 * 사이트 공통 정보 — 출처: [유한회사 상상마루] 2024 기업소개 PDF (연락처는 43쪽, 등록 정보는 3쪽, 21쪽)
 * 연락처·주소가 바뀌면 이 파일만 수정하면 헤더·푸터·오시는 길·JSON-LD 에 모두 반영됩니다.
 */
export const site = {
  name: "상상마루",
  nameEn: "Sangsangmaru",
  legalName: "유한회사 상상마루",
  slogan: "호기심 충전소",
  tagline: "4차 산업혁명시대 미래교육의 선두주자",
  title: "상상마루 - 익산 진로·직업체험 교육 전문기관",
  description:
    "유한회사 상상마루는 전북 익산의 교육부 인증 교육기부 진로체험기관입니다. 학교밖 방과후마을학교·늘봄학교, 자유학년제, 드론·3D프린터·코딩·로봇 진로체험, 드론축구단, 강사양성과정, 민간자격증 23종을 운영합니다.",
  keywords: [
    "상상마루",
    "익산 진로체험",
    "진로직업체험",
    "교육기부 진로체험기관",
    "방과후마을학교",
    "늘봄학교",
    "자유학년제",
    "익산 코딩교육",
    "드론축구",
    "드론교육",
    "3D프린팅 교육",
    "로봇코딩",
    "민간자격증",
    "강사양성과정",
    "창의융합축전",
    "하노이탑대회",
    "백제 문화상품",
    "예비사회적기업",
    "전북 진로체험",
  ],
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://imaginemaru.kr").replace(/\/$/, ""),
  locale: "ko_KR",
  /** 법인(단체) 등록 2013.2.1 — 전신 창의융합교육연구회 창립은 2012.3.2 */
  foundingYear: 2013,
  foundingDate: "2013-02-01",
  originYear: 2012,
  contact: {
    phone: "063-836-3383",
    fax: "063-831-3383",
    email: "steamsci@hanmail.net",
  },
  address: {
    full: "전북특별자치도 익산시 동서로49길 24-1 (영등동) 2층",
    region: "전북특별자치도",
    locality: "익산시",
    street: "동서로49길 24-1, 2층",
    /** TODO: 우편번호 확인 후 입력 (비어 있으면 JSON-LD 에서 제외) */
    postalCode: "",
  },
  business: {
    ceo: "조진욱",
    registrationNo: "651-86-01854",
    corporateNo: "214914-0052204",
    mailOrderNo: "제2021-전북익산-0092호",
  },
  store: {
    name: "상상마루샵",
    platform: "네이버 스마트스토어",
    /** TODO: 클라이언트에게 주소 확인 (기업소개 PDF 21쪽 검색 캡처 기준) */
    url: "https://smartstore.naver.com/sangnarae",
  },
  /** 인증·지정 (조직·인증 페이지, 메인 인증 스트립에 사용) */
  certifications: [
    { short: "교육부 인증", name: "교육기부 진로체험 인증기관", issuer: "교육부", period: "2023.07 ~ 2026.07", photo: "cert-moe" },
    { short: "예비사회적기업", name: "전북 예비사회적기업 지정", issuer: "전북특별자치도 (전북 2020-29호)", period: "2020.09", photo: "cert-social" },
    { short: "벤처기업", name: "벤처기업 확인 (제20230531010010호)", issuer: "벤처기업확인기관", period: "2023.05 ~ 2026.05", photo: "cert-venture" },
    { short: "기업부설연구소", name: "기업부설연구소 '상상연구소' 인정", issuer: "한국산업기술진흥협회", period: "2023.07", photo: "cert-lab" },
    { short: "우수 진로체험기관", name: "익산시 우수 진로체험기관", issuer: "익산시 · 익산교육지원청", period: "2018.12 ~ 2021.12", photo: "cert-iksan" },
    { short: "교육감 표창", name: "전북교육감 표창", issuer: "전라북도교육청", period: "2022.12", photo: "cert-award" },
  ],
} as const;

export const absoluteUrl = (path = "/") => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
