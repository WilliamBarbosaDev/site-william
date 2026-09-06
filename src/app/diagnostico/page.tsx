"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { CONFIG } from "@/data";
import {
  DIAGNOSTIC_QUESTIONS,
  generateDiagnostic,
  DiagnosticResult,
} from "@/data/ai-agent-knowledge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnimatedHighlight from "@/components/AnimatedHighlight";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Sparkles,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Building,
  User,
  Phone,
  Mail,
  RefreshCw,
  Send,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  isQuestion?: boolean;
  questionIndex?: number;
}

export default function DiagnosticoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [answers, setAnswers] = useState({
    segment: "",
    challenge: "",
    currentProcess: "",
    goal: "",
    clientName: "",
    companyName: "",
    phone: "",
    email: "",
  });

  const [contactInputs, setContactInputs] = useState({
    clientName: "",
    companyName: "",
    phone: "",
    email: "",
  });

  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [isSendingApi, setIsSendingApi] = useState(false);
  const [apiSentSuccess, setApiSentSuccess] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial welcome message
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages([
        {
          id: "welcome-1",
          sender: "ai",
          text: "Olá! Sou o Agente de IA do William Barbosa, especialista em estratégia, sistemas inteligentes e presença digital de alta conversão.",
          timestamp: "Agora",
        },
        {
          id: "welcome-2",
          sender: "ai",
          text: "Estou aqui para mapear a sua operação em poucos passos e diagnosticar qual a solução mais eficiente para o momento da sua empresa.",
          timestamp: "Agora",
        },
        {
          id: "q-0",
          sender: "ai",
          text: DIAGNOSTIC_QUESTIONS[0].question,
          timestamp: "Agora",
          isQuestion: true,
          questionIndex: 0,
        },
      ]);
      setIsTyping(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleSelectOption = (value: string, label: string) => {
    const question = DIAGNOSTIC_QUESTIONS[currentStep];
    const newAnswers = { ...answers, [question.field]: value };
    setAnswers(newAnswers);

    // Append user response to chat
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        sender: "user",
        text: label,
        timestamp: "Agora",
      },
    ]);

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    setIsTyping(true);

    setTimeout(() => {
      if (nextStep < DIAGNOSTIC_QUESTIONS.length) {
        setMessages((prev) => [
          ...prev,
          {
            id: `q-${nextStep}`,
            sender: "ai",
            text: DIAGNOSTIC_QUESTIONS[nextStep].question,
            timestamp: "Agora",
            isQuestion: true,
            questionIndex: nextStep,
          },
        ]);
        setIsTyping(false);
      } else {
        // Step to collect contact details
        setMessages((prev) => [
          ...prev,
          {
            id: "ask-contact",
            sender: "ai",
            text: "Perfeito! Já analisei os principais pontos. Para compor o seu dossiê estratégico e enviá-lo ao William Barbosa, por favor preencha seus dados de contato abaixo:",
            timestamp: "Agora",
          },
        ]);
        setIsTyping(false);
      }
    }, 600);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInputs.clientName.trim() || !contactInputs.phone.trim()) {
      alert("Por favor, preencha pelo menos seu nome e WhatsApp.");
      return;
    }

    const finalAnswers = {
      ...answers,
      clientName: contactInputs.clientName,
      companyName: contactInputs.companyName,
      phone: contactInputs.phone,
      email: contactInputs.email,
    };

    setAnswers(finalAnswers);

    // Add user response to chat
    setMessages((prev) => [
      ...prev,
      {
        id: `user-contact-${Date.now()}`,
        sender: "user",
        text: `${contactInputs.clientName} | ${contactInputs.companyName || "Empresa"} | WhatsApp: ${contactInputs.phone}`,
        timestamp: "Agora",
      },
    ]);

    setIsTyping(true);

    // Generate diagnostic
    const result = generateDiagnostic(finalAnswers);
    setDiagnosticResult(result);

    // Send payload to API route in background
    setIsSendingApi(true);
    try {
      await fetch("/api/diagnostico", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...finalAnswers,
          recommendedSolution: result.recommendedSolution,
          isCustomNeed: result.isCustomNeed,
          diagnosticSummary: result.diagnosticSummary,
        }),
      });
      setApiSentSuccess(true);
    } catch (err) {
      console.error("Erro ao enviar diagnóstico para a API:", err);
    } finally {
      setIsSendingApi(false);
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: "diagnostic-complete",
          sender: "ai",
          text: result.isCustomNeed
            ? "Diagnóstico concluído! Como o seu projeto possui características sob medida, preparei um encaminhamento direto para reunião com o William Barbosa. Confira a análise detalhada abaixo."
            : `Diagnóstico concluído! Com base no seu gargalo atual, identifiquei que a solução ideal é o ${result.recommendedSolution.name}. Confira o dossiê detalhado abaixo.`,
          timestamp: "Agora",
        },
      ]);
      setIsTyping(false);
    }, 1000);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setDiagnosticResult(null);
    setApiSentSuccess(false);
    setAnswers({
      segment: "",
      challenge: "",
      currentProcess: "",
      goal: "",
      clientName: "",
      companyName: "",
      phone: "",
      email: "",
    });
    setContactInputs({
      clientName: "",
      companyName: "",
      phone: "",
      email: "",
    });
    setMessages([
      {
        id: "welcome-restart",
        sender: "ai",
        text: "Vamos reiniciar o diagnóstico para um novo cenário ou empresa. Qual é o seu segmento de atuação?",
        timestamp: "Agora",
        isQuestion: true,
        questionIndex: 0,
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-bg-light text-text-dark flex flex-col selection:bg-accent selection:text-black">
      <ScrollProgress />
      <Header />

      <main className="flex-grow pt-8 pb-24 md:pb-32">
        {/* Top Header & Context */}
        <section className="mx-auto max-w-[1280px] px-5 md:px-7 lg:px-10 mb-10">
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[13px] font-medium text-muted-light hover:text-text-dark transition-colors duration-200 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Voltar para o início</span>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-200/80">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 border border-zinc-200/80 mb-4">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-700">
                  Agente de IA Ativo • Consultor Estratégico
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-text-dark leading-[1.14]">
                Diagnóstico inteligente para o seu{" "}
                <AnimatedHighlight variant="box">
                  negócio.
                </AnimatedHighlight>
              </h1>
              <p className="text-[15px] md:text-[16px] text-muted-light mt-3 leading-relaxed">
                Entenda em minutos qual solução de IA, sistema interno ou presença web de alta autoridade resolve o seu gargalo real.
              </p>
            </div>

            {/* Quick status badge */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-[16px] bg-white border border-zinc-200 shadow-xs self-start md:self-auto">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-text-dark">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div className="text-left">
                <div className="text-[12px] font-semibold text-text-dark leading-none">Assistente Oficial</div>
                <div className="text-[11px] font-mono text-zinc-500 mt-0.5">William Barbosa</div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Chat Window */}
        <section className="mx-auto max-w-[1280px] px-5 md:px-7 lg:px-10 mb-12">
          <div className="rounded-[36px] bg-white border border-zinc-200/80 shadow-card-hover overflow-hidden flex flex-col">
            
            {/* Chat Messages Stream */}
            <div className="p-6 md:p-10 space-y-6 max-h-[600px] overflow-y-auto bg-zinc-50/50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div className="w-9 h-9 rounded-full bg-[#09090b] text-accent flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                      <Bot className="w-4 h-4 text-accent" />
                    </div>
                  )}

                  <div
                    className={`max-w-xl p-4 md:p-5 rounded-[24px] text-[14px] md:text-[15px] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#09090b] text-white rounded-tr-sm shadow-sm"
                        : "bg-white text-zinc-800 border border-zinc-200/80 rounded-tl-sm shadow-xs"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span
                      className={`block font-mono text-[10px] mt-2 ${
                        msg.sender === "user" ? "text-zinc-400 text-right" : "text-zinc-400"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.sender === "user" && (
                    <div className="w-9 h-9 rounded-full bg-accent text-black flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[12px]">
                      Você
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex gap-3.5 items-center">
                  <div className="w-9 h-9 rounded-full bg-[#09090b] text-accent flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-accent" />
                  </div>
                  <div className="bg-white border border-zinc-200/80 px-4 py-3 rounded-[20px] flex items-center gap-1.5 shadow-xs">
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Interaction Options Area */}
            <div className="p-6 md:p-8 bg-white border-t border-zinc-200/80">
              {/* Option Pills when answering multiple-choice question */}
              {currentStep < DIAGNOSTIC_QUESTIONS.length && !isTyping && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
                      Passo 0{currentStep + 1} de 0{DIAGNOSTIC_QUESTIONS.length}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-400">
                      {DIAGNOSTIC_QUESTIONS[currentStep].explanation}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DIAGNOSTIC_QUESTIONS[currentStep].options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleSelectOption(opt.value, opt.label)}
                        className="text-left p-4 rounded-[18px] bg-zinc-50 hover:bg-[#09090b] hover:text-white border border-zinc-200/80 transition-all duration-200 group flex items-start justify-between"
                      >
                        <div>
                          <div className="text-[14px] font-medium leading-snug group-hover:text-white text-zinc-800">
                            {opt.label}
                          </div>
                          {opt.hint && (
                            <div className="text-[12px] text-zinc-500 group-hover:text-zinc-400 mt-1 font-normal">
                              {opt.hint}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-0.5 ml-2" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Form step when questions are finished */}
              {currentStep >= DIAGNOSTIC_QUESTIONS.length && !diagnosticResult && !isTyping && (
                <form onSubmit={handleContactSubmit} className="max-w-2xl mx-auto py-2">
                  <h4 className="text-[16px] font-semibold text-text-dark mb-1">
                    Para onde devemos enviar e registrar seu diagnóstico?
                  </h4>
                  <p className="text-[13px] text-zinc-500 mb-6">
                    Seus dados serão enviados diretamente para o especialista William Barbosa analisar o seu caso.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-[12px] font-mono text-zinc-600 mb-1.5">
                        Seu Nome *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: João da Silva"
                          value={contactInputs.clientName}
                          onChange={(e) =>
                            setContactInputs({ ...contactInputs, clientName: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[13px] focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-mono text-zinc-600 mb-1.5">
                        Nome da Empresa
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Ex: Silva Advocacia / Clínica Viva"
                          value={contactInputs.companyName}
                          onChange={(e) =>
                            setContactInputs({ ...contactInputs, companyName: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[13px] focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-mono text-zinc-600 mb-1.5">
                        WhatsApp com DDD *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          placeholder="Ex: (92) 99999-9999"
                          value={contactInputs.phone}
                          onChange={(e) =>
                            setContactInputs({ ...contactInputs, phone: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[13px] focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[12px] font-mono text-zinc-600 mb-1.5">
                        E-mail de Contato
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="Ex: contato@empresa.com"
                          value={contactInputs.email}
                          onChange={(e) =>
                            setContactInputs({ ...contactInputs, email: e.target.value })
                          }
                          className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-[14px] text-[13px] focus:outline-none focus:border-black transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 h-12 rounded-[14px] bg-[#09090b] text-white text-[14px] font-medium hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    <span>Gerar Diagnóstico Estratégico</span>
                    <Sparkles className="w-4 h-4 text-accent" />
                  </button>
                </form>
              )}

              {/* Completed state inside interaction box */}
              {diagnosticResult && (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-[13px] text-zinc-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Diagnóstico calculado com base nas particularidades da sua empresa.</span>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="inline-flex items-center gap-2 text-[12px] font-mono text-zinc-500 hover:text-black transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Fazer novo diagnóstico</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Structured Diagnostic Dossier (Rendered when completed) */}
        {diagnosticResult && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mx-auto max-w-[1280px] px-5 md:px-7 lg:px-10"
          >
            <div className="rounded-[36px] bg-[#09090b] text-white p-8 md:p-12 lg:p-16 border border-white/10 relative overflow-hidden shadow-2xl">
              
              {/* Top Badge and Lead info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-white/10 mb-8">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
                  <span className="rounded-full bg-accent/20 text-accent font-mono text-[11px] font-semibold px-3 py-1 uppercase tracking-wider">
                    {diagnosticResult.isCustomNeed
                      ? "Projeto Sob Medida • Reunião Prioritária"
                      : "Solução Recomendada por IA"}
                  </span>
                </div>

                <div className="font-mono text-[12px] text-zinc-400">
                  Lead: <strong className="text-white">{diagnosticResult.clientName}</strong> •{" "}
                  {diagnosticResult.companyName || "Empresa"}
                </div>
              </div>

              {/* Main Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-10">
                <div className="lg:col-span-7">
                  <span className="font-mono text-[11px] text-accent uppercase tracking-wider block mb-2 font-semibold">
                    Análise da Demanda
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4 leading-snug">
                    {diagnosticResult.recommendedSolution.name}
                  </h2>
                  <p className="text-[15px] text-zinc-300 leading-relaxed mb-6">
                    {diagnosticResult.diagnosticSummary}
                  </p>
                  <p className="text-[14px] text-zinc-400 leading-relaxed">
                    {diagnosticResult.actionRecommendation}
                  </p>
                </div>

                {/* Solution Highlight Box */}
                <div className="lg:col-span-5 bg-white/5 rounded-[28px] p-6 border border-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider">
                      Impacto Esperado
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white font-mono text-[11px]">
                      {diagnosticResult.recommendedSolution.category}
                    </span>
                  </div>
                  <div className="text-[15px] font-medium text-white mb-4 leading-snug">
                    {diagnosticResult.recommendedSolution.detailedBenefit}
                  </div>
                  <div className="p-4 rounded-[18px] bg-accent/10 border border-accent/20 text-accent text-[13px] leading-relaxed">
                    <strong>Resultado projetado:</strong> {diagnosticResult.recommendedSolution.expectedImpact}
                  </div>
                </div>
              </div>

              {/* CTAs and Notification Status */}
              <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`https://api.whatsapp.com/send?phone=${CONFIG.phone}&text=${encodeURIComponent(
                      diagnosticResult.whatsappMessage
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-7 h-13 rounded-[14px] bg-accent text-text-dark text-[14px] font-semibold hover:bg-[#c8ff00] hover:scale-[1.01] active:scale-[0.98] transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {diagnosticResult.isCustomNeed
                        ? "Agendar Reunião com William no WhatsApp"
                        : "Receber Diagnóstico no WhatsApp"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </a>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 h-13 rounded-[14px] bg-white/10 text-white text-[14px] font-medium hover:bg-white/15 transition-all duration-200"
                  >
                    <span>Voltar ao Site</span>
                  </Link>
                </div>

                <div className="text-[12px] font-mono text-zinc-400">
                  {apiSentSuccess ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Cópia arquivada e encaminhada para o especialista.
                    </span>
                  ) : (
                    <span>Notificação em processamento...</span>
                  )}
                </div>
              </div>

              {/* Subtle background glow */}
              <div className="absolute right-0 bottom-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
}
