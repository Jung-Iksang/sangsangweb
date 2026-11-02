import Image from "next/image";

/** A single cohesive 3D scene, decorative beside the existing introduction. */
export function HeroEducationCharacters({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Image
        src="/illustrations/hero-future-learning-v1.png"
        alt=""
        fill
        sizes="(min-width:1200px) 180px, (min-width:800px) 200px, (min-width:600px) 300px, 40vw"
        loading="eager"
        className="hero-scene-image"
      />
    </div>
  );
}
