import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { AboutIntro } from "@/components/home/AboutIntro";
import { Programs } from "@/components/home/Programs";
import { CareerSection } from "@/components/home/CareerSection";
import { NewsBoards } from "@/components/home/NewsBoards";
import { Partners } from "@/components/home/Partners";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      <Hero />
      <AboutIntro />
      <CareerSection />
      <Programs />
      <NewsBoards />
      <Partners />
    </>
  );
}
