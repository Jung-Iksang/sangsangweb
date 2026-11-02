import Link from "next/link";
import { site } from "@/config/site";
import { PhoneIcon } from "@/components/layout/Header";

export function CtaBanner() {
  return (
    <section aria-labelledby="cta-title" className="border-y border-line bg-cream">
      <div className="container-site flex flex-col gap-8 py-16 md:flex-row md:items-end md:justify-between md:py-20">
        <div className="max-w-2xl">
          <h2 id="cta-title" className="t-h2">
            우리 학교·기관에 맞는 진로체험,
            <br className="hidden sm:block" /> <span className="hl">함께 설계해</span> 보세요
          </h2>
          <p className="mt-4 text-[1rem] leading-relaxed text-muted">프로그램 구성, 일정, 비용까지 담당자가 직접 안내해 드립니다.</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-3">
          <a href={`tel:${site.contact.phone}`} className="btn btn-primary">
            <PhoneIcon /> {site.contact.phone}
          </a>
          <Link href="/about/location" className="btn btn-outline">
            오시는 길
          </Link>
        </div>
      </div>
    </section>
  );
}
