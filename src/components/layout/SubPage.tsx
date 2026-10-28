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

/** 서브페이지 공통 틀: 상단 타이틀 영역 + 좌측 섹션 메뉴 + 본문 */
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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-[#fff8e1]">
        <Decor />
        <div className="container-site relative py-12 md:py-16">
          <nav aria-label="현재 위치" className="mb-4 text-[13px] text-muted">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-primary">홈</Link>
              </li>
              {crumbs.map((c, i, arr) => (
                <li key={c.path + i} className="flex items-center gap-1.5">
                  <span aria-hidden className="text-line">›</span>
                  {i === arr.length - 1 ? (
                    <span aria-current="page" className="font-medium text-body">{c.name}</span>
                  ) : (
                    <Link href={c.path} className="hover:text-primary">{c.name}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          {section && <p className="mb-2 text-sm font-bold tracking-wide text-primary">{section.label}</p>}
          <h1 className="text-[28px] font-bold leading-tight text-ink md:text-[40px]">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted md:text-base">{description}</p>}
        </div>
      </section>

      {section?.children && (
        <nav aria-label={`${section.label} 하위 메뉴`} className="sticky top-[75px] z-30 border-b border-line bg-white lg:hidden">
          <ul className="container-site flex gap-1 overflow-x-auto py-2 [scrollbar-width:none]">
            {section.children.map((c) => (
              <li key={c.href} className="shrink-0">
                <Link
                  href={c.href}
                  aria-current={c.href === activeHref ? "page" : undefined}
                  className={`block rounded-full px-4 py-2 text-[14px] font-medium ${c.href === activeHref ? "bg-primary text-white" : "text-body hover:bg-surface"}`}
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className={`container-site py-12 md:py-16 ${section?.children ? "lg:grid lg:grid-cols-[210px_1fr] lg:gap-12" : ""}`}>
        {section?.children && (
          <aside className="hidden lg:block">
            <div className="sticky top-[100px] overflow-hidden rounded-card border border-line">
              <p className="bg-primary px-5 py-4 text-[17px] font-bold text-white">{section.label}</p>
              <ul className="py-2">
                {section.children.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      aria-current={c.href === activeHref ? "page" : undefined}
                      className={`flex items-center justify-between px-5 py-3 text-[15px] transition-colors ${c.href === activeHref ? "font-bold text-primary" : "text-body hover:text-primary"}`}
                    >
                      {c.label}
                      <span aria-hidden className={c.href === activeHref ? "" : "opacity-0"}>›</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
        <div className="min-w-0">{children}</div>
      </div>
    </>
  );
}

function Decor() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute -right-10 -top-10 h-56 w-56 rounded-[36px] bg-brand-green/15 rotate-12" />
      <div className="absolute right-40 top-24 h-24 w-24 rounded-[20px] bg-brand-yellow/20 -rotate-6" />
      <div className="absolute -bottom-12 right-16 h-36 w-36 rounded-[28px] bg-brand-red/10 rotate-[20deg]" />
    </div>
  );
}
