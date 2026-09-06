import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://williambdesigner.com.br"),
  title: "William Barbosa | Sites, Design e Soluções Digitais",
  description:
    "Sites, landing pages, identidade visual, conteúdo e automações para empresas, profissionais e agências. Conheça o trabalho de William Barbosa.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://williambdesigner.com.br",
    title: "Estratégia, design e tecnologia para transformar presença digital em resultado.",
    description:
      "Conheça projetos e soluções de William Barbosa para empresas, profissionais e agências que desejam se posicionar, comunicar e operar melhor.",
    images: [
      {
        url: "/assets/MINHA ID/Frame 12.png",
        width: 1200,
        height: 900,
        alt: "William Barbosa - Design, Estratégia & Tecnologia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "William Barbosa | Sites, Design e Soluções Digitais",
    description:
      "Sites, landing pages, identidade visual, conteúdo e automações para empresas, profissionais e agências.",
    images: ["/assets/MINHA ID/Frame 12.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD structured data schemas for search engines
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://williambdesigner.com.br/#person",
        "name": "William Barbosa",
        "jobTitle": "Designer, Web Designer & Especialista em Soluções Digitais",
        "url": "https://williambdesigner.com.br",
        "sameAs": [
          "https://instagram.com/williamb.designer",
          "https://linkedin.com/in/williambarbosa",
          "https://behance.net/williambarbosa"
        ],
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Manaus",
          "addressRegion": "AM",
          "addressCountry": "BR"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://williambdesigner.com.br/#service",
        "name": "William Barbosa — Portfolio & Serviços Digitais",
        "image": "https://williambdesigner.com.br/assets/MINHA ID/Frame 12.png",
        "telephone": "+5592999999999",
        "email": "contato@williambdesigner.com.br",
        "url": "https://williambdesigner.com.br",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Manaus",
          "addressRegion": "AM",
          "addressCountry": "BR"
        },
        "priceRange": "$$",
        "areaServed": "BR",
        "description": "Estratégia, design e tecnologia para construir experiências digitais que posicionam, convencem e vendem."
      }
    ]
  };

  return (
    <html lang="pt-BR" className="h-full antialiased scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-bg-light text-text-dark font-sans select-text">
        {children}
      </body>
    </html>
  );
}
