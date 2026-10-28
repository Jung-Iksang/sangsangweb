import Image from "next/image";
import { partners } from "@/content/about";

export function Partners() {
  return (
    <section aria-labelledby="partners-title" className="border-t border-line py-12">
      <div className="container-site">
        <h2 id="partners-title" className="mb-6 text-center text-[14px] font-bold text-muted">함께하는 기관</h2>
        <ul className="grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p) => (
            <li key={p.name} className="flex justify-center">
              <Image src={p.src} alt={p.name} width={Math.round((p.width / p.height) * 48)} height={48} className="h-10 w-auto object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0 md:h-12" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
