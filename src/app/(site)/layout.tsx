import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/styles/typography.css";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="public-site">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-green focus:px-4 focus:py-2 focus:text-white">
        본문 바로가기
      </a>
      <Header />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}
