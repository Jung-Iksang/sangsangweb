import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import SiteNotFound from "./(site)/not-found";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <SiteNotFound />
      </main>
      <Footer />
    </>
  );
}
