/**
 * 상단 메뉴 정의 — 메뉴 구성이 바뀌면 이 파일만 수정하면
 * 헤더·모바일 메뉴·서브페이지 좌측 메뉴·브레드크럼·사이트맵에 모두 반영됩니다.
 */
export type MenuChild = { label: string; href: string };
export type MenuItem = { label: string; href: string; children?: MenuChild[] };

export const mainMenu: MenuItem[] = [
  {
    label: "단체소개",
    href: "/about/greeting",
    children: [
      { label: "인사말", href: "/about/greeting" },
      { label: "연혁", href: "/about/history" },
      { label: "오시는 길", href: "/about/location" },
    ],
  },
  { label: "진로·직업체험", href: "/career" },
  {
    label: "교육활동",
    href: "/education/afterschool",
    children: [
      { label: "방과후/늘봄 교육", href: "/education/afterschool" },
      { label: "학교밖 늘봄교육", href: "/education/outside" },
      { label: "자유학년(기)제", href: "/education/freeyear" },
      { label: "탑마루드론축구단", href: "/education/drone" },
      { label: "HRD-Net강사양성과정", href: "/education/hrd" },
      { label: "교육기부 진로체험", href: "/education/volunteer" },
    ],
  },
  {
    label: "체험활동",
    href: "/experience/creative",
    children: [
      { label: "창의적체험활동", href: "/experience/creative" },
      { label: "SW.AI교육주간", href: "/experience/swai" },
      { label: "과학의날 행사 지원", href: "/experience/science" },
      { label: "문화예술체험 교육", href: "/experience/culture" },
    ],
  },
  {
    label: "커뮤니티",
    href: "/community/notice",
    children: [
      { label: "공지사항", href: "/community/notice" },
      { label: "보도자료", href: "/community/press" },
      { label: "포토갤러리", href: "/community/gallery" },
    ],
  },
  { label: "스토어", href: "/store" },
];

/** 현재 경로가 속한 1차 메뉴를 찾는다 (서브페이지 좌측 메뉴·브레드크럼용) */
export function findSection(pathname: string) {
  for (const item of mainMenu) {
    const prefix = "/" + item.href.split("/")[1];
    if (pathname === item.href || pathname.startsWith(prefix + "/") || pathname === prefix) {
      const child = item.children?.find(
        (c) => pathname === c.href || pathname.startsWith(c.href + "/"),
      );
      return { section: item, child };
    }
  }
  return null;
}
