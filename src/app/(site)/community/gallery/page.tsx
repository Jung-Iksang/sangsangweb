import { GalleryGrid, galleryDescription } from "@/components/community/GalleryGrid";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "갤러리", description: galleryDescription, path: "/community/gallery" });

export default function Page() {
  return <GalleryGrid page={1} />;
}
