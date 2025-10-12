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

        {/* Galleries pinned to bottom of the page sections */}
        <section id="gallery" className="container">
          {/* Finished Products */}
          <h2 className="sr-only">Finished Products</h2>
          <Gallery endpoint="/api/gallery/finished" hashKey="gallery" />

          {/* Spacing between the two galleries */}
          <div style={{ marginTop: "3rem" }} />

          {/* Setups & Repairs */}
          <h2 className="sr-only">Setups & Repairs</h2>
          <Gallery endpoint="/api/gallery/repairs" hashKey="repairs" />
        </section>
      </main>
      <Footer />
    </>
  );
}
