import Link from "next/link";
import { findSection } from "@/config/menu";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";

type Props = {
  /** 현재 페이지 경로 (좌측 메뉴 활성화·브레드크럼 계산) */
  path: string;
  /** 페이지 제목 — 띠 제목(bandTitle 없을 때)·브레드크럼 JSON-LD 마지막 항목 */
  title: string;
  /** 띠에 크게 보일 제목. 상세 글은 게시판 이름을 띠에 두고 글 제목은 본문에서 h1 으로 보여준다 (DetailHead) */
  bandTitle?: string;
  description?: string;
  children: React.ReactNode;
};

/** 서브페이지 공통 틀: 가운데 정렬 타이틀 띠 + 띠 위로 떠 있는 좌측 섹션 메뉴 카드 + 본문 */
export function SubPage({ path, title, bandTitle, description, children }: Props) {
  const found = findSection(path);
  const section = found?.section;
  const activeHref = found?.child?.href ?? section?.href;
  const hasMenu = Boolean(section?.children);
  const heading = bandTitle ?? title;
  const Heading = bandTitle ? "p" : "h1";

  const raw: { name: string; path: string }[] = [];
  if (section) raw.push({ name: section.label, path: section.href });
  if (found?.child) raw.push({ name: found.child.label, path: found.child.href });
  if (raw[raw.length - 1]?.name !== title) raw.push({ name: title, path });
  const crumbs = raw.filter((c, i) => raw.findIndex((x) => x.name === c.name) === i);
  // 화면 브레드크럼은 띠 제목까지만 (상세 글 제목은 본문에 있음)
  const shownEnd = crumbs.findIndex((c) => c.name === heading);
  const shown = shownEnd >= 0 ? crumbs.slice(0, shownEnd + 1) : crumbs;

  const grid = hasMenu ? "lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14" : "";

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="grad-band border-b border-line">
        <div className={`container-read ${grid}`}>
          {hasMenu && <div aria-hidden className="hidden lg:block" />}
          <div className="flex min-h-[180px] flex-col items-center justify-center py-10 text-center lg:min-h-[220px]">
            {/* 상세 글은 글 제목이 본문에서 h1 — 띠의 게시판 이름은 h1 이 아님 (모든 글의 h1 이 같아지지 않게) */}
            <Heading className="text-[clamp(1.75rem,1.4rem+1.2vw,2.25rem)] font-bold leading-tight text-ink">{heading}</Heading>
            <nav aria-label="현재 위치" className="mt-4 text-[15px] text-muted">
              <ol className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
                <li>
                  <Link href="/" aria-label="홈" className="block hover:text-ink">
                    <HomeIcon />
                  </Link>
                </li>
                {shown.map((c, i, arr) => (
                  <li key={c.path + i} className="flex items-center gap-2.5">
                    <Chevron className="h-2 w-2 text-line-strong" />
                    {i === arr.length - 1 ? (
                      <span aria-current="page" className="line-clamp-1 text-body">{c.name}</span>
                    ) : (
                      <Link href={c.path} className="hover:text-ink">{c.name}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            {description && <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted">{description}</p>}
          </div>
        </div>
      </section>

      {hasMenu && section?.children && (
        <nav aria-label={`${section.label} 하위 메뉴`} className="sticky top-[var(--header-h)] z-30 border-b border-line bg-paper lg:hidden">
          <ul className="container-site flex gap-6 overflow-x-auto [scrollbar-width:none]">
            {section.children.map((c) => {
              const active = c.href === activeHref;
              return (
                <li key={c.href} className="shrink-0">
                  <Link
                    href={c.href}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b-2 py-3.5 text-[16px] ${active ? "border-green font-semibold text-ink" : "border-transparent text-muted hover:text-ink"}`}
                  >
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className={`container-read pb-20 pt-12 md:pb-28 md:pt-16 ${grid}`}>
        {hasMenu && section?.children && (
          <aside className="relative z-10 -mt-[196px] hidden lg:block">
            <nav aria-label={`${section.label} 메뉴`} className="sticky top-[calc(var(--header-h)+24px)]">
              <h2 className="-ml-4 mr-5 flex h-[168px] justify-center rounded-[44px_14px_14px_14px] grad-kiwi pt-12 text-[24px] font-bold text-white">
                {section.label}
              </h2>
              <ul className="relative -mt-[64px] rounded-[16px_16px_32px_16px] bg-white px-6 pb-5 pt-3 shadow-dropdown">
                {section.children.map((c) => {
                  const active = c.href === activeHref;
                  return (
                    <li key={c.href} className="border-b border-line">
                      <Link
                        href={c.href}
                        aria-current={active ? "page" : undefined}
                        className={`group flex items-center justify-between gap-3 py-3.5 text-[17px] leading-snug transition-colors ${active ? "font-semibold text-green" : "text-muted hover:text-ink"}`}
                      >
                        {c.label}
                        <span
                          aria-hidden
                          className={`grid h-5 w-5 shrink-0 place-items-center rounded-[4px] ${active ? "bg-green text-white" : "bg-cream text-muted group-hover:text-ink"}`}
                        >
                          <Chevron className="h-2 w-2" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        )}
        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.6" className={className}>
      <path d="M2.5 1 5.5 4l-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="h-4 w-4">
      <path d="M2.5 7 8 2.5 13.5 7v6.5h-3.5v-4H6v4H2.5V7Z" strokeLinejoin="round" />
    </svg>
  );
}
