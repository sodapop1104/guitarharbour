import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesAndPricing from "@/components/ServicesAndPricing";
import ConsultationCTA from "@/components/ConsultationCTA";
import Shop from "@/components/Shop";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery"; // 👈 import the new gallery

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesAndPricing />
        {/* NEW: CTA lives directly after Services & Pricing */}
        <ConsultationCTA />

        {/* NEW: Gallery lives right after Shop */}
        <section id="gallery" className="container">
          <Gallery />
        </section>

        <section id="about">
          <div className="container">
            <About />
          </div>
        </section>
        <Contact />
      </main>
      <Footer />
    </>
  );
}