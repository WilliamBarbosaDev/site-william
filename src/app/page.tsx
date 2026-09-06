import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Projects from "@/components/sections/Projects";
import Solutions from "@/components/sections/Solutions";
import AiSystems from "@/components/sections/AiSystems";
import Process from "@/components/sections/Process";
import Authority from "@/components/sections/Authority";
import About from "@/components/sections/About";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import SocialContact from "@/components/sections/SocialContact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollProgress from "@/components/ScrollProgress";
import { getSectionContent } from "@/lib/cms/content-service";

export default async function Home() {
  const heroContent = await getSectionContent("home", "hero");
  const authorityMarqueeItems = [
    "+9 ANOS DE EXPERIÊNCIA",
    "+100 CLIENTES ATENDIDOS",
    "ESTRATÉGIA",
    "UX/UI",
    "WEB",
    "SISTEMAS",
    "AUTOMAÇÃO",
    "INTELIGÊNCIA ARTIFICIAL",
    "PROJETOS PARA EMPRESAS"
  ];

  const servicesMarqueeItems = [
    "ESTRATÉGIA",
    "UX/UI & DESIGN",
    "SITES E LANDING PAGES",
    "SISTEMAS INTERNOS",
    "AUTOMAÇÕES & IA",
    "PARCERIA PARA AGÊNCIAS",
    "SOLUÇÕES DIGITAIS"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      {/* Global Scroll Progress indicator */}
      <ScrollProgress />

      {/* Floating CTA WhatsApp */}
      <WhatsAppButton />

      {/* Header Navigation */}
      <Header />

      <main className="flex-grow">
        {/* Hero Section */}
        <Hero cmsContent={heroContent} />

        {/* 1st Faixa Marquee (Authority) */}
        <Marquee items={authorityMarqueeItems} duration="26s" theme="dark" />

        {/* Highlighted Projects */}
        <Projects />

        {/* Solutions section (with sticky layout) */}
        <Solutions />

        {/* 2nd Faixa Marquee (Services) */}
        <Marquee items={servicesMarqueeItems} duration="24s" theme="dark" />

        {/* Dedicated AI & Internal Systems Grid Showcase */}
        <AiSystems />

        {/* Process Section */}
        <Process />

        {/* Authority cards (B2B, Experience, 360) */}
        <Authority />

        {/* About William */}
        <About />

        {/* Accordion FAQ */}
        <FAQ />

        {/* Social channels and CTAs */}
        <SocialContact />
      </main>

      {/* Extended Footer */}
      <Footer />
    </div>
  );
}
