import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServicesAndPricing from "@/components/ServicesAndPricing";
import ConsultationCTA from "@/components/ConsultationCTA";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ServicesAndPricing />
        <ConsultationCTA />

        <section id="about">
          <div className="container">
            <About />
          </div>
        </section>

        <Contact />

        {/* Gallery pinned to bottom of the page sections */}
        <section id="gallery" className="container">
          <Gallery />
        </section>
      </main>
      <Footer />
    </>
  );
}