import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesAndPricing from "@/components/ServicesAndPricing";
import ConsultationCTA from "@/components/ConsultationCTA";
import Shop from "@/components/Shop";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesAndPricing />
        {/* NEW: CTA lives directly after Services & Pricing */}
        <ConsultationCTA />
        <Shop />
        <section id="about"><div className="container"><About /></div></section>
        <Contact />
      </main>
      <Footer />
    </>
  );
}