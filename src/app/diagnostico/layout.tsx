import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agente de IA Consultor & Diagnóstico Estratégico | William Barbosa",
  description:
    "Converse com o Agente de IA de William Barbosa para mapear gargalos operacionais e descobrir a solução ideal de inteligência artificial, sistemas ou web para o seu negócio.",
};

export default function DiagnosticoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
