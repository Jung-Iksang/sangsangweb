import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function AboutIntroReveal({ children }: { children: ReactNode }) {
  return <section aria-labelledby="about-title" className="about-intro"><ScrollReveal>{children}</ScrollReveal></section>;
}
