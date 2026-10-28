import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { mainMenu } from "@/config/menu";
import { getGalleryIndex, getPostIndex } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = new Set<string>(["/"]);
  for (const m of mainMenu) {
    staticPaths.add(m.href);
    m.children?.forEach((c) => staticPaths.add(c.href));
  }

  const [posts, gallery] = await Promise.all([getPostIndex(), getGalleryIndex()]);
  const latest = posts[0]?.updatedAt ?? gallery[0]?.createdAt;

  return [
    ...[...staticPaths].map((path) => ({
      url: absoluteUrl(path),
      changeFrequency: (path === "/" || path.startsWith("/community") ? "daily" : "monthly") as "daily" | "monthly",
      priority: path === "/" ? 1 : path.startsWith("/community") ? 0.7 : 0.8,
      ...(path === "/" || path.startsWith("/community") ? { lastModified: latest } : {}),
    })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/community/${p.boardType}/${p.id}`),
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...gallery.map((g) => ({
      url: absoluteUrl(`/community/gallery/${g.id}`),
      lastModified: g.createdAt,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
  ];
}
