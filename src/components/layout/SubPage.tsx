import Link from "next/link";
import { findSection } from "@/config/menu";
import { breadcrumbJsonLd, JsonLd } from "@/lib/seo";

type Props = {
  /** 현재 페이지 경로 (좌측 메뉴 활성화·브레드크럼 계산) */
  path: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

/** 서브페이지 공통 틀: 크림 타이틀 띠 + 좌측 섹션 메뉴 + 본문 */
export function SubPage({ path, title, description, children }: Props) {
  const found = findSection(path);
  const section = found?.section;
  const activeHref = found?.child?.href ?? section?.href;

  const raw: { name: string; path: string }[] = [];
  if (section) raw.push({ name: section.label, path: section.href });
  if (found?.child) raw.push({ name: found.child.label, path: found.child.href });
  if (raw[raw.length - 1]?.name !== title) raw.push({ name: title, path });
  const crumbs = raw.filter((c, i) => raw.findIndex((x) => x.name === c.name) === i);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <section className="border-b border-line bg-cream">
        <div className="container-read py-11 md:py-17">
          <nav aria-label="현재 위치" className="type-caption mb-8 text-muted">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-ink">홈</Link>
              </li>
              {crumbs.map((c, i, arr) => (
                <li key={c.path + i} className="flex items-center gap-2">
                  <span aria-hidden className="text-line-strong">/</span>
                  {i === arr.length - 1 ? (
                    <span aria-current="page" className="line-clamp-1 text-ink">{c.name}</span>
                  ) : (
                    <Link href={c.path} className="hover:text-ink">{c.name}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {section && <p className="num mb-3">{section.label}</p>}
          <h1 className="t-h1 max-w-4xl">{title}</h1>
          {description && <p className="t-lead mt-5 max-w-3xl text-muted">{description}</p>}
        </div>
      </section>

      {section?.children && (
        <nav aria-label={`${section.label} 하위 메뉴`} className="sticky top-[var(--header-h)] z-30 border-b border-line bg-paper lg:hidden">
          <ul className="container-site flex gap-6 overflow-x-auto [scrollbar-width:none]">
            {section.children.map((c) => {
              const active = c.href === activeHref;
              return (
                <li key={c.href} className="shrink-0">
                  <Link
                    href={c.href}
                    aria-current={active ? "page" : undefined}
                    className={`block border-b-2 py-3.5 type-menu-link ${active ? "border-green font-semibold text-ink" : "border-transparent text-muted hover:text-ink"}`}
                  >
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}

      <div className={`container-read py-14 md:py-20 ${section?.children ? "lg:grid lg:grid-cols-[13.75rem_minmax(0,1fr)] lg:gap-14" : ""}`}>
        {section?.children && (
          <aside className="hidden lg:block">
            <nav aria-label={`${section.label} 메뉴`} className="sticky top-[calc(var(--header-h)+2rem)]">
              <h2 className="border-b border-ink pb-3 text-[0.9375rem] font-bold text-ink">{section.label}</h2>
              <ul>
                {section.children.map((c) => {
                  const active = c.href === activeHref;
                  return (
                    <li key={c.href} className="border-b border-line">
                      <Link
                        href={c.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-2.5 py-3.5 type-menu-link transition-colors ${active ? "font-semibold text-ink" : "text-muted hover:text-ink"}`}
                      >
                        <span aria-hidden className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? "bg-green" : "bg-transparent"}`} />
                        {c.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        )}
        <div className="site-page-content min-w-0">{children}</div>
      </div>
    </>
  );
}
