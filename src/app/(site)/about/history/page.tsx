import { SubPage } from "@/components/layout/SubPage";
import { history } from "@/content/about";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "연혁",
  description:
    "2012년 창의융합교육연구회 창립부터 2013년 법인 등록, 예비사회적기업 지정, 벤처기업·기업부설연구소, 교육부 진로체험 인증기관까지 상상마루가 걸어온 길입니다.",
  path: "/about/history",
  keywords: ["상상마루 연혁", "창의융합교육연구회", "상상나래"],
});

export default function Page() {
  return (
    <SubPage path="/about/history" title="연혁" description="2012년 창의융합교육연구회에서 시작해 학생·지역과 함께 성장해 온 발자취">
      <ol className="border-t border-ink">
        {history.map((h, i) => (
          <li key={h.year} className="grid gap-4 border-b border-line py-8 md:grid-cols-[160px_1fr] md:gap-10">
            <h2 className={`text-[32px] font-extrabold tabular-nums tracking-tight md:text-[36px] ${i === 0 ? "text-green" : "text-ink"}`}>{h.year}</h2>
            <ul className="space-y-2.5 md:pt-2.5">
              {h.items.map((it) => (
                <li key={it} className="flex gap-3 text-[16px] leading-relaxed text-body">
                  <span aria-hidden className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-line-strong" />
                  {it}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </SubPage>
  );
}
