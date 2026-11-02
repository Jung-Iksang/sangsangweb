import type { Metadata, Viewport } from "next";
import { site } from "@/config/site";
import "./globals.css";

const naver = process.env.NAVER_SITE_VERIFICATION;
const google = process.env.GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  keywords: [...site.keywords],
  applicationName: site.name,
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    url: "/",
    title: site.title,
    description: site.description,
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og-default.png"] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    ...(google ? { google } : {}),
    ...(naver ? { other: { "naver-site-verification": naver } } : {}),
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" data-scroll-behavior="smooth">
      <head>
        {/* Paperlogy (OFL) 자체 호스팅 — 본문·제목 글꼴. 본문(500)·제목(700) 은 미리 받음 */}
        <link rel="preload" href="/fonts/paperlogy/Paperlogy-500.subset.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/paperlogy/Paperlogy-700.subset.woff2" as="font" type="font/woff2" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/paperlogy/paperlogy.css" />
        {/* Pretendard Variable (OFL) — Paperlogy 서브셋(완성형 2,350자)에 없는 글자 폴백. 동적 서브셋이라 쓰인 범위만 내려받음.
            unicode-range 서브셋 92개는 next/font 가 지원하지 않아 public 의 CSS 를 직접 연결 */}
        {/* eslint-disable-next-line @next/next/no-css-tags */}
        <link rel="stylesheet" href="/fonts/pretendard/pretendard.css" />
        <link rel="alternate" type="application/rss+xml" title={`${site.name} 소식`} href="/rss.xml" />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
