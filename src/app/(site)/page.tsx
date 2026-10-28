import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { QuickLinks } from "@/components/home/QuickLinks";
import { AboutIntro } from "@/components/home/AboutIntro";
import { CertStrip } from "@/components/home/CertStrip";
import { Programs } from "@/components/home/Programs";
import { CareerSection } from "@/components/home/CareerSection";
import { NewsBoards } from "@/components/home/NewsBoards";
import { GallerySection } from "@/components/home/GallerySection";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Partners } from "@/components/home/Partners";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <Hero />
      <QuickLinks />
      <AboutIntro />
      <CertStrip />
      <Programs />
      <CareerSection />
      <NewsBoards />
      <GallerySection />
      <CtaBanner />
      <Partners />
    </>
  );
}
