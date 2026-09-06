import { getDb } from "@/lib/db";
import { randomUUID } from "node:crypto";

export interface Lead {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  source: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "PROPOSAL" | "CLIENT" | "LOST";
  diagnostic_id?: string;
  recommended_services_json?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DiagnosticRecord {
  id: string;
  lead_id?: string;
  client_name: string;
  company_name?: string;
  phone: string;
  email?: string;
  segment?: string;
  challenge?: string;
  current_process?: string;
  goal?: string;
  maturity_score: number;
  is_custom_need: number;
  recommended_solution?: string;
  summary?: string;
  provider_used?: string;
  model_used?: string;
  raw_payload_json?: string;
  created_at: string;
}

export async function createLeadFromDiagnostic(data: {
  clientName: string;
  companyName?: string;
  phone: string;
  email?: string;
  segment?: string;
  challenge?: string;
  currentProcess?: string;
  goal?: string;
  recommendedSolution?: string;
  isCustomNeed?: boolean;
  diagnosticSummary?: string;
  providerUsed?: string;
  modelUsed?: string;
}) {
  const db = await getDb();
  const now = new Date().toISOString();
  const leadId = randomUUID();
  const diagnosticId = randomUUID();

  // Save diagnostic record
  db.prepare(`
    INSERT INTO diagnostics (
      id, lead_id, client_name, company_name, phone, email,
      segment, challenge, current_process, goal,
      maturity_score, is_custom_need, recommended_solution, summary,
      provider_used, model_used, created_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?
    )
  `).run(
    diagnosticId,
    leadId,
    data.clientName,
    data.companyName || null,
    data.phone,
    data.email || null,
    data.segment || null,
    data.challenge || null,
    data.currentProcess || null,
    data.goal || null,
    data.isCustomNeed ? 85 : 70,
    data.isCustomNeed ? 1 : 0,
    data.recommendedSolution || null,
    data.diagnosticSummary || null,
    data.providerUsed || "AI Router Central",
    data.modelUsed || "gemini-2.5-flash",
    now
  );

  // Save lead record
  db.prepare(`
    INSERT INTO leads (
      id, name, company, phone, email, source, status,
      diagnostic_id, recommended_services_json, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, 'DIAGNOSTICO_IA', 'NEW',
      ?, ?, ?, ?
    )
  `).run(
    leadId,
    data.clientName,
    data.companyName || null,
    data.phone,
    data.email || null,
    diagnosticId,
    JSON.stringify([data.recommendedSolution].filter(Boolean)),
    now,
    now
  );

  return { leadId, diagnosticId };
}

export async function getAllLeads(): Promise<Lead[]> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all() as Lead[];
  return rows;
}

export async function updateLeadStatus(id: string, status: Lead["status"], notes?: string) {
  const db = await getDb();
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE leads
    SET status = ?,
        notes = COALESCE(?, notes),
        updated_at = ?
    WHERE id = ?
  `).run(status, notes || null, now, id);
}

export async function getAllDiagnostics(): Promise<DiagnosticRecord[]> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM diagnostics ORDER BY created_at DESC").all() as DiagnosticRecord[];
  return rows;
}

export async function getDiagnosticById(id: string): Promise<DiagnosticRecord | null> {
  const db = await getDb();
  const row = db.prepare("SELECT * FROM diagnostics WHERE id = ?").get(id) as DiagnosticRecord | undefined;
  return row || null;
}
