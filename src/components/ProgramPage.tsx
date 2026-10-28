import Link from "next/link";
import Image from "next/image";
import { SubPage } from "@/components/layout/SubPage";
import { PhoneIcon } from "@/components/layout/Header";
import { site } from "@/config/site";
import { categoryLabel, programsBy, type Program } from "@/content/programs";
import { photos } from "@/content/photos.generated";
import { courseJsonLd, JsonLd } from "@/lib/seo";

/** 교육활동·체험활동 공통 상세 템플릿 */
export function ProgramPage({ program: p }: { program: Program }) {
  const path = `/${p.category}/${p.slug}`;
  const siblings = programsBy(p.category).filter((x) => x.slug !== p.slug);
  const hero = photos[p.image];
  return (
    <SubPage path={path} title={p.title} description={p.summary}>
      <JsonLd data={courseJsonLd({ name: p.title, description: p.summary, path })} />
      <article className="space-y-12">
        <div className="relative aspect-[16/8] overflow-hidden rounded-card bg-surface">
          <Image src={hero.src} alt={`${p.title} 활동 모습`} fill priority sizes="(min-width:1024px) 880px, 100vw" className="object-cover" />
          {p.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[13px] font-bold text-primary shadow">
              {p.badge}
            </span>
          )}
        </div>

        <section aria-labelledby="intro">
          <h2 id="intro" className="sr-only">프로그램 소개</h2>
          <div className="space-y-3 text-[17px] leading-[1.9] text-body">
            {p.intro.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </section>

        {p.highlights && (
          <dl className="grid gap-3 sm:grid-cols-3">
            {p.highlights.map((h) => (
              <div key={h.k} className="rounded-2xl bg-primary-50 p-5">
                <dt className="sr-only">{h.v}</dt>
                <dd className="text-[24px] font-bold text-primary">{h.k}</dd>
                <dd className="mt-1 text-[14px] leading-snug text-body">{h.v}</dd>
              </div>
            ))}
          </dl>
        )}

        <section aria-labelledby="features">
          <Heading id="features">{p.featuresTitle ?? "프로그램 특징"}</Heading>
          <ul className="grid gap-3 sm:grid-cols-2">
            {p.features.map((f, i) => (
              <li key={f} className="flex items-start gap-3 rounded-2xl border border-line bg-white p-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-[13px] font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="pt-1 text-[15.5px] font-medium text-ink">{f}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="targets">
          <Heading id="targets">대상</Heading>
          <ul className="flex flex-wrap gap-2">
            {p.targets.map((t) => (
              <li key={t} className="rounded-full bg-primary-50 px-4 py-2 text-[15px] font-medium text-primary">
                {t}
              </li>
            ))}
          </ul>
        </section>

        {p.sections?.map((s, si) => (
          <section key={s.title} aria-labelledby={`section-${si}`}>
            <Heading id={`section-${si}`}>{s.title}</Heading>
            <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {s.items.map((d) => (
                <div key={d.label} className={`px-5 py-4 ${d.value ? "grid gap-1 sm:grid-cols-[200px_1fr] sm:gap-6" : ""}`}>
                  <dt className="font-bold text-ink">{d.label}</dt>
                  {d.value && <dd className="leading-relaxed text-body">{d.value}</dd>}
                </div>
              ))}
            </dl>
          </section>
        ))}

        {p.table && (
          <section aria-labelledby="table">
            <Heading id="table">{p.table.caption}</Heading>
            <div className="overflow-x-auto rounded-2xl border border-line">
              <table className="w-full min-w-[560px] text-left text-[14.5px]">
                <caption className="sr-only">{p.table.caption}</caption>
                <thead className="bg-surface text-[13px] text-muted">
                  <tr>
                    {p.table.columns.map((c) => (
                      <th key={c} scope="col" className="whitespace-nowrap px-4 py-3 font-bold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {p.table.rows.map((r) => (
                    <tr key={r.join("|")}>
                      {r.map((cell, ci) => (
                        <td key={ci} className={`px-4 py-3 align-top ${p.table!.columns[ci] === "자격명" ? "font-bold text-ink" : "text-body"}`}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {p.photos && p.photos.length > 0 && (
          <section aria-labelledby="photos">
            <Heading id="photos">활동 사진</Heading>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {p.photos.map((ph) => {
                const img = photos[ph.name];
                return (
                  <li key={ph.name}>
                    <figure>
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                        <Image src={img.src} alt={`${p.title} 사진 — ${ph.alt}`} fill sizes="(min-width:1024px) 290px, 50vw" className="object-cover" />
                      </div>
                      <figcaption className="mt-2 text-[13px] text-muted">{ph.alt}</figcaption>
                    </figure>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {p.links && (
          <ul className="flex flex-wrap gap-2">
            {p.links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="inline-flex h-11 items-center gap-1 rounded-full border border-primary px-5 font-bold text-primary hover:bg-primary-50"
                >
                  {l.label} <span aria-hidden>→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <section aria-labelledby="contact" className="rounded-card bg-gradient-to-br from-primary to-[#3b82f6] p-7 text-white md:p-10">
          <h2 id="contact" className="text-[22px] font-bold">{p.title} 문의</h2>
          <p className="mt-2 text-white/85">
            전화 {site.contact.phone} · 이메일 {site.contact.email}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${site.contact.phone}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-primary hover:bg-primary-50">
              <PhoneIcon /> {p.ctaLabel}
            </a>
            <a href={`mailto:${site.contact.email}?subject=${encodeURIComponent(`[${p.title}] 문의`)}`} className="inline-flex h-12 items-center rounded-full border border-white/60 px-6 font-bold hover:bg-white/10">
              이메일 문의
            </a>
          </div>
        </section>

        <nav aria-labelledby="related">
          <Heading id="related">다른 {categoryLabel[p.category]}</Heading>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.category}/${s.slug}`} className="group block rounded-2xl border border-line p-5 transition hover:border-primary/50 hover:shadow-card">
                  <p className="font-bold text-ink group-hover:text-primary">{s.title}</p>
                  <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-muted">{s.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>
    </SubPage>
  );
}

function Heading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-5 flex items-center gap-2 text-[22px] font-bold text-ink">
      <span aria-hidden className="h-5 w-1.5 rounded-full bg-primary" />
      {children}
    </h2>
  );
}
