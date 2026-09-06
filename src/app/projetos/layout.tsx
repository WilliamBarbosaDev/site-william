import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projetos & Portfólio Completo | William Barbosa",
  description:
    "Explore todos os projetos desenvolvidos por William Barbosa em sites estratégicos, landing pages de alta conversão, plataformas e soluções com Inteligência Artificial.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
