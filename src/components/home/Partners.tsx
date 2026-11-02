import Image from "next/image";
import { partners } from "@/content/about";

// The end logos include white margins inside their source images.
const edgeLogoInsets: Record<string, [number, number]> = {
  "/partners/moe.png": [72, 85],
  "/partners/jb-science-hub.png": [17, 14],
};

export function Partners() {
  return (
    <section aria-label="협력 기관" className="border-t border-[#eaeaea] bg-white py-8 md:py-10">
      <div className="site-content-frame">
        <ul className="grid grid-cols-2 items-center gap-x-6 gap-y-6 [--partner-logo-height:3rem] sm:grid-cols-3 md:[--partner-logo-height:3.5rem] lg:grid-cols-6 lg:gap-x-8">
          {partners.map((p) => {
            const [left, right] = edgeLogoInsets[p.src] ?? [0, 0];
            const visibleWidth = p.width - left - right;
            return (
              <li key={p.name} className="flex h-16 min-w-0 items-center justify-center first:justify-start last:justify-end">
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: `${visibleWidth} / ${p.height}`,
                    maxWidth: `min(${12.5 * visibleWidth / p.width}rem, calc(var(--partner-logo-height) * ${visibleWidth / p.height}))`,
                  }}
                >
                  <Image
                    src={p.src}
                    alt={p.name}
                    width={p.width}
                    height={p.height}
                    sizes="(min-width: 2160px) 300px, (min-width: 1024px) 14vw, (min-width: 640px) 28vw, 42vw"
                    className="absolute top-0 h-full max-w-none"
                    style={{ width: `${100 * p.width / visibleWidth}%`, left: `${-100 * left / visibleWidth}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
