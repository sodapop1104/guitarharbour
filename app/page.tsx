// app/page.tsx
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Repairs from "@/components/Repairs";
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
        <Services />
        <Repairs />
        <Shop />
        <section id="about"><div className="container"><About /></div></section>
        <Contact />
      </main>
      <Footer />
    </>
  );
}