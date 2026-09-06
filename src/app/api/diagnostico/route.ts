import { NextResponse } from "next/server";
import { CONFIG } from "@/data";
import { createLeadFromDiagnostic } from "@/lib/leads/leads-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientName,
      companyName,
      phone,
      email,
      segment,
      challenge,
      currentProcess,
      goal,
      recommendedSolution,
      isCustomNeed,
      diagnosticSummary,
    } = body;

    // Persist lead and diagnostic record in local database
    let savedIds: { leadId: string; diagnosticId: string } | null = null;
    try {
      savedIds = await createLeadFromDiagnostic({
        clientName,
        companyName,
        phone,
        email,
        segment,
        challenge,
        currentProcess,
        goal,
        recommendedSolution: recommendedSolution?.name,
        isCustomNeed,
        diagnosticSummary,
      });
    } catch (dbErr) {
      console.error("Erro ao salvar lead/diagnóstico no banco:", dbErr);
    }

    const notificationPayload = {
      timestamp: new Date().toISOString(),
      toEmail: CONFIG.email,
      lead: {
        name: clientName,
        company: companyName,
        phone,
        email: email || "Não informado",
      },
      answers: {
        segment,
        challenge,
        currentProcess,
        goal,
      },
      diagnostic: {
        recommendedSolution: recommendedSolution?.name,
        isCustomNeed,
        summary: diagnosticSummary,
      },
    };

    // Log structured diagnostic in production server logs
    console.log("=== NOVO DIAGNÓSTICO RECEBIDO DO AGENTE DE IA ===");
    console.log(JSON.stringify(notificationPayload, null, 2));

    // In Next.js App Router, if an external email provider (Resend, SendGrid, etc.) or webhook is configured in environment variables, it can be called here:
    if (process.env.NOTIFICATION_WEBHOOK_URL) {
      try {
        await fetch(process.env.NOTIFICATION_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(notificationPayload),
        });
      } catch (webhookErr) {
        console.error("Erro ao disparar webhook de notificação:", webhookErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Diagnóstico registrado e notificação encaminhada com sucesso.",
        lead: clientName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erro na API de diagnóstico:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao processar diagnóstico." },
      { status: 500 }
    );
  }
}
