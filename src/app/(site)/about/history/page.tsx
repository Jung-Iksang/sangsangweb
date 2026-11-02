import { SubPage } from "@/components/layout/SubPage";
import { history } from "@/content/about";
import { pageMetadata } from "@/lib/seo";
import { HistoryTimeline } from "@/components/history/HistoryTimeline";

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
      <HistoryTimeline entries={history} />
    </SubPage>
  );
}
