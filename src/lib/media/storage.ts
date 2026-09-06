import { getDb } from "@/lib/db";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface MediaRecord {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  url: string;
  created_at: string;
}

export async function saveUploadedFile(file: File): Promise<MediaRecord> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(`Tipo de arquivo não permitido: ${file.type}. Permitidos: JPG, PNG, WEBP, SVG, GIF.`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Tamanho de arquivo excede o limite máximo de 10MB.`);
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const extension = path.extname(file.name) || ".png";
  const sanitizedBase = path.basename(file.name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .slice(0, 40);

  const uniqueFilename = `${sanitizedBase}-${Date.now()}${extension}`;
  const filePath = path.join(uploadDir, uniqueFilename);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const publicUrl = `/uploads/${uniqueFilename}`;
  const id = randomUUID();
  const now = new Date().toISOString();

  const db = await getDb();
  db.prepare(`
    INSERT INTO media (id, filename, original_name, mime_type, file_size, url, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, uniqueFilename, file.name, file.type, file.size, publicUrl, now);

  return {
    id,
    filename: uniqueFilename,
    original_name: file.name,
    mime_type: file.type,
    file_size: file.size,
    url: publicUrl,
    created_at: now,
  };
}

export async function getAllMedia(): Promise<MediaRecord[]> {
  const db = await getDb();
  const rows = db.prepare("SELECT * FROM media ORDER BY created_at DESC").all() as MediaRecord[];
  return rows;
}

export async function deleteMedia(id: string): Promise<boolean> {
  const db = await getDb();
  const media = db.prepare("SELECT * FROM media WHERE id = ?").get(id) as MediaRecord | undefined;
  if (!media) return false;

  const filePath = path.join(process.cwd(), "public", "uploads", media.filename);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.warn("Arquivo físico não encontrado para remoção:", e);
    }
  }

  db.prepare("DELETE FROM media WHERE id = ?").run(id);
  return true;
}
