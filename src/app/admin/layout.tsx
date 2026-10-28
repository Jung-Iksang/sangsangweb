import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "관리자", template: "%s | 상상마루 관리자" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-cream">{children}</div>;
}
