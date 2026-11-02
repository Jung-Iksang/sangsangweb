import Link from "next/link";
import { getLatestGallery, getLatestPosts, type PostSummary } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { GalleryCarousel } from "./GalleryCarousel";
import "./NewsBoards.css";

export async function NewsBoards() {
  const [notice, gallery] = await Promise.all([getLatestPosts("notice", 5), getLatestGallery(10)]);
  const dates = Object.fromEntries(gallery.map((item) => [item.id, formatDate(item.createdAt)]));
  return (
    <section aria-label="상상마루 소식" className="news-hub">
      <div className="site-content-frame news-hub-grid">
        <section aria-labelledby="notice-title" className="news-notices">
          <div className="news-panel-head">
            <h2 id="notice-title"><Link href="/community/notice">공지사항</Link></h2>
          </div>
          <NoticeList items={notice} />
        </section>
        <GalleryCarousel items={gallery} dates={dates} />
      </div>
    </section>
  );
}

function NoticeList({ items }: { items: PostSummary[] }) {
  if (items.length === 0) return <p className="news-empty">등록된 공지사항이 없습니다.</p>;
  return (
    <ul className="news-notice-list">
      {items.map((post) => (
        <li key={post.id}>
          <Link href={`/community/notice/${post.id}`}>
            <span className="news-notice-title">{post.title}</span>
            {post.isNew && <span className="news-new" aria-label="새 글">N</span>}
            <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          </Link>
        </li>
      ))}
    </ul>
  );
}
