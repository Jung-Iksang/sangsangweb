import { absoluteUrl, site } from "@/config/site";
import { getRecentPostsAll } from "@/lib/data";
import { boardLabel } from "@/lib/format";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/** 네이버 서치어드바이저 · 구글 서치콘솔 제출용 RSS (공지사항 + 보도자료) */
export async function GET() {
  const posts = await getRecentPostsAll(30);
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/community/${p.boardType}/${p.id}`);
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <category>${boardLabel[p.boardType]}</category>
      <description>${esc(p.excerpt)}</description>
      <pubDate>${new Date(p.createdAt).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(site.name)} 소식</title>
    <link>${site.url}</link>
    <description>${esc(site.description)}</description>
    <language>ko</language>
    <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
