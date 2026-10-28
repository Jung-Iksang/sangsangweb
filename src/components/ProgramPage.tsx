import Link from "next/link";
import { SmartImage } from "@/components/ui/SmartImage";
import { SubPage } from "@/components/layout/SubPage";
import { PhoneIcon } from "@/components/layout/Header";
import { site } from "@/config/site";
import { categoryLabel, programsBy, type Program } from "@/content/programs";
import { courseJsonLd, JsonLd } from "@/lib/seo";

/** 교육활동·체험활동 공통 상세 템플릿 */
export function ProgramPage({ program: p }: { program: Program }) {
  const path = `/${p.category}/${p.slug}`;
  const siblings = programsBy(p.category).filter((x) => x.slug !== p.slug);
  return (
    <SubPage path={path} title={p.title} description={p.summary}>
      <JsonLd data={courseJsonLd({ name: p.title, description: p.summary, path })} />
      <article className="space-y-12">
        <div className="relative aspect-[16/8] overflow-hidden rounded-card">
          <SmartImage src={p.image} alt={`${p.title} 활동 모습`} fill priority sizes="(min-width:1024px) 880px, 100vw" className="object-cover" />
        </div>

        <section aria-labelledby="intro">
          <h2 id="intro" className="sr-only">프로그램 소개</h2>
          <div className="space-y-3 text-[17px] leading-[1.9] text-body">
            {p.intro.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
        </section>

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

        {p.details && (
          <section aria-labelledby="details">
            <Heading id="details">{p.detailsTitle}</Heading>
            <dl className="divide-y divide-line overflow-hidden rounded-2xl border border-line">
              {p.details.map((d) => (
                <div key={d.label} className="grid gap-1 px-5 py-4 sm:grid-cols-[160px_1fr] sm:gap-6">
                  <dt className="font-bold text-ink">{d.label}</dt>
                  <dd className="text-body">{d.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {p.schedule.length > 0 && (
          <section aria-labelledby="schedule">
            <Heading id="schedule">{p.scheduleTitle ?? "운영 일정"}</Heading>
            <dl className="grid gap-3 sm:grid-cols-2">
              {p.schedule.map((s) => (
                <div key={s.label} className="rounded-2xl bg-surface p-5">
                  <dt className="text-[13px] font-bold text-muted">{s.label}</dt>
                  <dd className="mt-1 text-[16px] font-medium text-ink">{s.value}</dd>
                </div>
              ))}
            </dl>
          </section>
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
