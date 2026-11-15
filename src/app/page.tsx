import About from "@/components/sections/About";
import AIInnovation from "@/components/sections/AIInnovation";
import Contact from "@/components/sections/Contact";
import Hero from "@/components/sections/Hero";
import Process from "@/components/sections/Process";
import Services from "@/components/sections/Services";
import TechStack from "@/components/sections/TechStack";
import WhatsApp from "@/components/sections/WhatsApp";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <div className="shell"><div className="hairline" /></div>
      <Services />
      <AIInnovation />
      <div className="shell"><div className="hairline" /></div>
      <WhatsApp />
      <Process />
      <TechStack />
      <div className="shell"><div className="hairline" /></div>
      <Contact />
    </>
  );
}
