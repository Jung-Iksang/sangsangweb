import { Gate } from "@/components/home/Gate";
import { AboutIntro } from "@/components/home/AboutIntro";
import { BizGrid } from "@/components/home/BizGrid";
import { CareerSection } from "@/components/home/CareerSection";
import { NewsBoards } from "@/components/home/NewsBoards";
import { GallerySection } from "@/components/home/GallerySection";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Partners } from "@/components/home/Partners";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { site } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <h1 className="sr-only">{site.title}</h1>
      <Gate />
      <AboutIntro />
      <BizGrid />
      <CareerSection />
      <NewsBoards />
      <GallerySection />
      <CtaBanner />
      <Partners />
    </>
  );
}
