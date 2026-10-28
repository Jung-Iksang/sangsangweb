import Link from "next/link";

export function SectionHead({
  eyebrow,
  title,
  desc,
  moreHref,
  moreLabel = "전체보기",
  align = "left",
  id,
}: {
  eyebrow: string;
  title: string;
  desc?: string;
  moreHref?: string;
  moreLabel?: string;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div className={`mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${align === "center" ? "items-center text-center md:flex-col md:items-center" : ""}`}>
      <div>
        <p className="mb-2 text-[13px] font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h2 id={id} className="text-[26px] font-bold leading-snug text-ink md:text-[34px]">{title}</h2>
        {desc && <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted md:text-base">{desc}</p>}
      </div>
      {moreHref && (
        <Link href={moreHref} className="inline-flex shrink-0 items-center gap-1 text-[14px] font-medium text-body hover:text-primary">
          {moreLabel} <span aria-hidden>→</span>
        </Link>
      )}
    </div>
  );
}
