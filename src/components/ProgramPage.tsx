import Link from "next/link";
import Image from "next/image";
import { SubPage } from "@/components/layout/SubPage";
import { PhoneIcon } from "@/components/layout/Header";
import { site } from "@/config/site";
import { categoryLabel, programsBy, type Program } from "@/content/programs";
import { photos } from "@/content/photos.generated";
import { courseJsonLd, JsonLd } from "@/lib/seo";
import { AnimatedStat } from "@/components/ui/CountUp";

/** 교육활동·체험활동 공통 상세 템플릿 */
export function ProgramPage({ program: p }: { program: Program }) {
  const path = `/${p.category}/${p.slug}`;
  const siblings = programsBy(p.category).filter((x) => x.slug !== p.slug);
  const hero = photos[p.image];
  // 섹션 번호 01, 02 … (등장 순서대로)
  let n = 0;
  const next = () => String(++n).padStart(2, "0");

  return (
    <SubPage path={path} title={p.title} description={p.summary}>
      <JsonLd data={courseJsonLd({ name: p.title, description: p.summary, path })} />
      <article className="space-y-20">
        <div>
          <div className="relative aspect-[16/8] overflow-hidden rounded-md bg-line">
            <Image src={hero.src} alt={`${p.title} 활동 모습`} fill priority sizes="(min-width:1024px) 55rem, 100vw" className="object-cover" />
            {p.badge && (
              <span className="absolute left-4 top-4 rounded-sm border border-line bg-white px-2.5 py-1 text-[0.75rem] font-bold text-ink">
                {p.badge}
              </span>
            )}
          </div>

          <div className="type-reading mt-12 space-y-4 text-body">
            {p.intro.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>

          {p.highlights && (
            <dl className="mt-12 grid divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {p.highlights.map((h) => (
                <div key={h.k} className="py-6 sm:px-6 sm:first:pl-0">
                  <dt className="sr-only">{h.v}</dt>
                  <dd className="text-[1.75rem] font-extrabold tracking-tight text-green">
                    <AnimatedStat value={h.k} />
                  </dd>
                  <dd className="mt-1.5 text-[0.84375rem] leading-snug text-muted">{h.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <Block id="features" no={next()} title={p.featuresTitle ?? "프로그램 특징"}>
          <ol className="border-t border-ink">
            {p.features.map((f, i) => (
              <li key={f} className="flex gap-5 border-b border-line py-4">
                <span className="num pt-1">{String(i + 1).padStart(2, "0")}.</span>
                <span className="type-body font-medium text-ink">{f}</span>
              </li>
            ))}
          </ol>
        </Block>

        <Block id="targets" no={next()} title="대상">
          <ul className="flex flex-wrap gap-2">
            {p.targets.map((t) => (
              <li key={t} className="rounded-sm border border-line-strong bg-white px-3.5 py-2 text-[0.90625rem] font-medium text-ink">
                {t}
              </li>
            ))}
          </ul>
        </Block>

        {p.sections?.map((s, si) => (
          <Block key={s.title} id={`section-${si}`} no={next()} title={s.title}>
            <dl className="border-t border-ink">
              {s.items.map((d) => (
                <div key={d.label} className={`border-b border-line py-4 ${d.value ? "grid gap-1 sm:grid-cols-[12.5rem_1fr] sm:gap-8" : ""}`}>
                  <dt className="font-bold text-ink">{d.label}</dt>
                  {d.value && <dd className="leading-relaxed text-body">{d.value}</dd>}
                </div>
              ))}
            </dl>
          </Block>
        ))}

        {p.table && (
          <Block id="table" no={next()} title={p.table.caption}>
            <div className="overflow-x-auto border-t border-ink">
              <table className="w-full min-w-[35rem] text-left text-[0.90625rem]">
                <caption className="sr-only">{p.table.caption}</caption>
                <thead className="text-[0.8125rem] text-muted">
                  <tr className="border-b border-line-strong">
                    {p.table.columns.map((c) => (
                      <th key={c} scope="col" className="whitespace-nowrap py-3 pr-4 font-semibold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {p.table.rows.map((r) => (
                    <tr key={r.join("|")} className="border-b border-line">
                      {r.map((cell, ci) => (
                        <td
                          key={ci}
                          className={`py-3 pr-4 align-top ${p.table!.columns[ci] === "자격명" ? "font-bold text-ink" : ci === 0 ? "tabular-nums text-muted" : "text-body"}`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>
        )}

        {p.photos && p.photos.length > 0 && (
          <Block id="photos" no={next()} title="활동 사진">
            <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
              {p.photos.map((ph) => {
                const img = photos[ph.name];
                return (
                  <li key={ph.name}>
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-line">
                        <Image src={img.src} alt={`${p.title} 사진 — ${ph.alt}`} fill sizes="(min-width:1024px) 18.125rem, 50vw" className="object-cover" />
                      </div>
                      <figcaption className="mt-3 text-[0.8125rem] leading-snug text-muted">{ph.alt}</figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          </Block>
        )}

        {p.links && (
          <ul className="flex flex-wrap gap-6">
            {p.links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="btn btn-ghost text-[1rem]">
                  {l.label} <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <section aria-labelledby="contact" className="rounded-md border border-line bg-cream p-8 md:p-10">
          <h2 id="contact" className="t-h3">{p.title} 문의</h2>
          <p className="mt-2 text-muted">
            전화 {site.contact.phone} · 이메일 {site.contact.email}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${site.contact.phone}`} className="btn btn-primary">
              <PhoneIcon /> {p.ctaLabel}
            </a>
            <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`[${p.title}] 문의`)}`} className="btn btn-outline">
              이메일 문의
            </a>
          </div>
        </section>

        <nav aria-labelledby="related">
          <h2 id="related" className="border-b border-ink pb-4 text-[1.0625rem] font-bold text-ink">
            다른 {categoryLabel[p.category]}
          </h2>
          <ul>
            {siblings.map((s) => (
              <li key={s.slug} className="border-b border-line">
                <Link href={`/${s.category}/${s.slug}`} className="group flex items-center gap-6 py-5">
                  <span className="min-w-0 flex-1">
                    <span className="block text-[1.0625rem] font-bold text-ink group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">{s.title}</span>
                    <span className="mt-1 block truncate text-[0.875rem] text-muted">{s.summary}</span>
                  </span>
                  <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>
    </SubPage>
  );
}

function Block({ id, no, title, children }: { id: string; no: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <p className="num">{no}</p>
      <h2 id={id} className="type-subsection-title mb-6 mt-2 text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}
