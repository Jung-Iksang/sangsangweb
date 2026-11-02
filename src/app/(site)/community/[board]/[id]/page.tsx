import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SubPage } from "@/components/layout/SubPage";
import { DetailHead } from "@/components/community/DetailHead";
import { PrevNext } from "@/components/community/PrevNext";
import { ViewCounter } from "@/components/community/ViewCounter";
import { BOARD_TYPES, type BoardType } from "@/db/schema";
import { getPost, getPostIndex } from "@/lib/data";
import { boardLabel } from "@/lib/format";
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
    <SubPage path={path} title={post.title} bandTitle={boardLabel[post.boardType]}>
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
        <DetailHead title={post.title} createdAt={post.createdAt} views={post.views} />
        <div className="prose-post border-b border-line px-1 py-10 md:px-4" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <div className="mt-10 flex justify-center">
        <Link href={base} className="btn btn-dark px-10">
          목록
        </Link>
      </div>
      <PrevNext prev={post.prev} next={post.next} base={base} />
    </SubPage>
  );
}
