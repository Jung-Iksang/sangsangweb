import { SubPage } from "@/components/layout/SubPage";
import { SmartImage } from "@/components/ui/SmartImage";
import { greeting } from "@/content/about";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "인사말",
  description: "모든 학생이 꿈을 발견하고 그 꿈을 향해 나아가도록 돕는 진로·직업체험 교육 플랫폼, 상상마루 대표 인사말입니다.",
  path: "/about/greeting",
  keywords: ["상상마루 소개", "진로교육 기관"],
});

export default function Page() {
  return (
    <SubPage path="/about/greeting" title="인사말" description="꿈을 상상하고, 미래를 체험하는 곳 상상마루입니다.">
      <div className="grid gap-10 md:grid-cols-[1fr_300px]">
        <div className="space-y-6 text-[17px] leading-[1.9] text-body">
          <p className="text-[24px] font-bold leading-snug text-ink md:text-[28px]">{greeting.lead}</p>
          {greeting.body.map((t) => (
            <p key={t}>{t}</p>
          ))}
          {greeting.sections.map((s) => (
            <section key={s.title} className="rounded-2xl bg-surface p-6">
              <h2 className="mb-2 text-[19px] font-bold text-primary">{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
          <p>{greeting.closing}</p>
          <p className="text-right text-[18px] font-bold text-ink">{greeting.signature}</p>
        </div>
        <div className="relative hidden aspect-[3/4] overflow-hidden rounded-card md:block">
          <SmartImage src="/mock/career-3.svg" alt="상상마루 교육 현장" fill sizes="300px" className="object-cover" />
        </div>
      </div>
    </SubPage>
  );
}
