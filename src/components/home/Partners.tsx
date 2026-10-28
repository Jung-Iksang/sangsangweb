import Image from "next/image";
import { partners } from "@/content/about";
import { SectionHead } from "./SectionHead";

export function Partners() {
  return (
    <section aria-labelledby="partners-title" className="py-20 md:py-24">
      <div className="container-site">
        <SectionHead no="06" id="partners-title" title="함께하는 기관" />
        <ul className="grid grid-cols-2 border-l border-t border-line sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <li key={p.name} className="flex h-24 items-center justify-center border-b border-r border-line bg-white px-4">
              <Image
                src={p.src}
                alt={p.name}
                width={Math.round((p.width / p.height) * 44)}
                height={44}
                className="h-9 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-10"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
