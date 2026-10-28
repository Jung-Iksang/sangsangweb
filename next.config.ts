import type { NextConfig } from "next";

// 이미지 CDN(CloudFront) 도메인. 예: d1234abcd.cloudfront.net 또는 img.imaginemaru.kr
const cdnDomain = process.env.NEXT_PUBLIC_CDN_DOMAIN;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,

  // 검색엔진 수집기(네이버 Yeti, 다음, 구글 등)에는 스트리밍 없이
  // 완성된 HTML 한 덩어리를 보내도록 한다. (기본 목록을 덮어쓰므로 기본 봇도 포함)
  htmlLimitedBots:
    /Yeti|NaverBot|Daum|Daumoa|Googlebot|Google-InspectionTool|Mediapartners-Google|AdsBot-Google|Google-PageRenderer|bingbot|Bingbot|Yandex|Baiduspider|DuckDuckBot|Slurp|facebookexternalhit|Twitterbot|Slackbot|kakaotalk-scrap|Kakao|LinkedInBot|Discordbot|TelegramBot/i,

  serverExternalPackages: ["@electric-sql/pglite"],

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: cdnDomain ? [{ protocol: "https", hostname: cdnDomain }] : [],
  },

  async redirects() {
    // 섹션 루트 → 첫 하위 페이지
    const sections = [
      { source: "/about", destination: "/about/greeting" },
      { source: "/education", destination: "/education/afterschool" },
      { source: "/experience", destination: "/experience/creative" },
      { source: "/community", destination: "/community/notice" },
    ].map((r) => ({ ...r, statusCode: 301 as const }));
    // 기존 사이트(정적 HTML) 주소 → 새 주소 (검색 노출 유지용 301 — 네이버 권장 상태코드)
    const legacy = [
      ["/index.html", "/"],
      ["/pages/about/:page.html", "/about/:page"],
      ["/pages/education/:page.html", "/education/:page"],
      ["/pages/experience/:page.html", "/experience/:page"],
      ["/pages/community/notice.html", "/community/notice"],
      ["/pages/community/press.html", "/community/press"],
      ["/pages/community/gallery.html", "/community/gallery"],
      ["/pages/community/gallery-view.html", "/community/gallery"],
      ["/pages/community/view.html", "/community/notice"],
      ["/pages/store/store.html", "/store"],
      ["/pages/login.html", "/"],
      ["/pages/signup.html", "/"],
    ].map(([source, destination]) => ({ source, destination, statusCode: 301 as const }));
    return [...sections, ...legacy];
  },

  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
