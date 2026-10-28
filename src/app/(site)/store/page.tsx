import Link from "next/link";
import { SubPage } from "@/components/layout/SubPage";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "스토어",
  description: "코딩 교구, 로봇 키트, 드론, 과학 실험 키트 등 상상마루 교육 도구 스토어가 곧 문을 엽니다.",
  path: "/store",
});

export default function Page() {
  return (
    <SubPage path="/store" title="스토어" description="상상마루 교육 현장에서 쓰는 교구를 만나보세요.">
      <div className="flex flex-col items-center rounded-card border border-dashed border-line px-6 py-20 text-center">
        <span className="rounded-full bg-brand-yellow/20 px-4 py-1.5 text-[13px] font-bold text-[#a07800]">COMING SOON</span>
        <h2 className="mt-5 text-[26px] font-bold text-ink">스토어 준비 중입니다</h2>
        <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-muted">
          코딩 교구, 로봇 키트, 드론, 과학 실험 키트, 보드게임 등 교육 도구를 곧 소개해 드릴 예정입니다. 교구 구매·대여 문의는 아래로 연락 주세요.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`tel:${site.contact.phone}`} className="inline-flex h-12 items-center rounded-full bg-primary px-6 font-bold text-white hover:bg-primary-dark">
            교구 문의 {site.contact.phone}
          </a>
          <Link href="/" className="inline-flex h-12 items-center rounded-full border border-line px-6 font-bold text-ink hover:border-primary hover:text-primary">
            홈으로
          </Link>
        </div>
      </div>
    </SubPage>
  );
}
