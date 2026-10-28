import Link from "next/link";
import { site } from "@/config/site";
import { PhoneIcon } from "@/components/layout/Header";

export function CtaBanner() {
  return (
    <section aria-labelledby="cta-title" className="pb-20 md:pb-28">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary to-[#3b82f6] px-7 py-12 text-white md:px-14 md:py-16">
          <div aria-hidden className="absolute -right-8 -top-10 h-44 w-44 rotate-12 rounded-[34px] bg-brand-yellow/30" />
          <div aria-hidden className="absolute bottom-[-40px] right-40 h-32 w-32 -rotate-12 rounded-[26px] bg-brand-green/30" />
          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="cta-title" className="text-[24px] font-bold leading-snug md:text-[32px]">
                우리 학교·기관에 맞는 진로체험,
                <br className="hidden sm:block" /> 상상마루와 함께 설계해 보세요
              </h2>
              <p className="mt-3 text-[15px] text-white/85 md:text-base">프로그램 구성, 일정, 비용까지 담당자가 친절히 안내해 드립니다.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <a href={`tel:${site.contact.phone}`} className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-bold text-primary hover:bg-primary-50">
                <PhoneIcon /> {site.contact.phone}
              </a>
              <Link href="/about/location" className="inline-flex h-12 items-center rounded-full border border-white/60 px-6 font-bold text-white hover:bg-white/10">
                오시는 길
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
