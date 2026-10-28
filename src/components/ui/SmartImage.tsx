import Image, { type ImageProps } from "next/image";

/** SVG 목업·로컬 업로드 이미지는 최적화 없이, 그 외(CloudFront)는 next/image 최적화 */
export function SmartImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const unoptimized = props.unoptimized ?? (src.endsWith(".svg") || src.startsWith("/uploads/"));
  return <Image {...props} unoptimized={unoptimized} alt={props.alt} />;
}
