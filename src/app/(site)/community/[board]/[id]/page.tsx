import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubPage } from "@/components/layout/SubPage";
import { ViewCounter } from "@/components/community/ViewCounter";
import { BOARD_TYPES, type BoardType } from "@/db/schema";
import { getPost, getPostIndex } from "@/lib/data";
import { boardLabel, formatDate } from "@/lib/format";
import { articleJsonLd, JsonLd, pageMetadata } from "@/lib/seo";

// 검색엔진에 완성된 HTML·정확한 404 상태를 주기 위해 URL 값을 기다려 서버에서 완전히 렌더링
export const instant = false;

export async function generateStaticParams() {
  const index = await getPostIndex();
  const params = index.map((p) => ({ board: p.boardType, id: String(p.id) }));
  // Cache Components 는 최소 1개의 예시 값이 필요 (없는 글은 404 처리)
  return params.length ? params : [{ board: "notice", id: "0" }];
}

async function load(params: Promise<{ board: string; id: string }>) {
  const { board, id } = await params;
  if (!BOARD_TYPES.includes(board as BoardType)) notFound();
  const post = await getPost(board as BoardType, Number(id));
  if (!post) notFound();
  return post;
}

export async function generateMetadata({ params }: PageProps<"/community/[board]/[id]">): Promise<Metadata> {
  const post = await load(params);
  return pageMetadata({
    title: post.title,
    description: post.excerpt || `${boardLabel[post.boardType]} - ${post.title}`,
    path: `/community/${post.boardType}/${post.id}`,
    image: post.thumbnailUrl,
    type: "article",
    publishedTime: post.createdAt,
    modifiedTime: post.updatedAt,
  });
}

export default async function Page({ params }: PageProps<"/community/[board]/[id]">) {
  const post = await load(params);
  const base = `/community/${post.boardType}`;
  const path = `${base}/${post.id}`;
  return (
    <SubPage path={path} title={post.title}>
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.excerpt,
          path,
          image: post.thumbnailUrl,
          datePublished: post.createdAt,
          dateModified: post.updatedAt,
        })}
      />
      <ViewCounter id={post.id} />
      <article>
        <header className="flex flex-wrap items-center gap-3 border-b-2 border-ink pb-4 text-[0.875rem] text-muted">
          <Link href={base} className="num hover:underline">
            {boardLabel[post.boardType]}
          </Link>
          <span aria-hidden className="text-line-strong">/</span>
          <time dateTime={post.createdAt} className="tabular-nums">{formatDate(post.createdAt)}</time>
        </header>
        <div className="prose-post py-10" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <nav aria-label="이전·다음 글" className="border-y border-line text-[0.9375rem]">
        <Neighbor label="다음 글" item={post.next} base={base} />
        <Neighbor label="이전 글" item={post.prev} base={base} />
      </nav>
      <div className="mt-8 flex justify-center">
        <Link href={base} className="btn btn-outline px-10">
          목록으로
        </Link>
      </div>
    </SubPage>
  );
}

function Neighbor({ label, item, base }: { label: string; item: { id: number; title: string } | null; base: string }) {
  return (
    <div className="flex items-center gap-4 border-b border-line px-2 py-4 last:border-b-0">
      <span className="w-16 shrink-0 font-bold text-muted">{label}</span>
      {item ? (
        <Link href={`${base}/${item.id}`} className="truncate text-body hover:text-green">{item.title}</Link>
      ) : (
        <span className="text-muted/70">{label}이 없습니다.</span>
      )}
    </div>
  );
}
