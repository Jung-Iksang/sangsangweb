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
      <ol className="relative space-y-10 border-l-2 border-primary-100 pl-8 md:pl-12">
        {history.map((h, i) => (
          <li key={h.year} className="relative">
            <span
              aria-hidden
              className={`absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-4 border-white ring-2 md:-left-[57px] ${i === 0 ? "bg-primary ring-primary" : "bg-white ring-primary-100"}`}
            />
            <h2 className={`text-[28px] font-bold md:text-[32px] ${i === 0 ? "text-primary" : "text-ink"}`}>{h.year}</h2>
            <ul className="mt-3 space-y-2">
              {h.items.map((it) => (
                <li key={it} className="rounded-xl bg-surface px-5 py-3 text-[16px] text-body">
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
