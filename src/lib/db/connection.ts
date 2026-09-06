import path from "node:path";
import fs from "node:fs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dbInstance: any = null;

export function getDatabase(): any {
  if (dbInstance) {
    return dbInstance;
  }

  // Ensure data directory exists
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, "site.db");

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Database = require("better-sqlite3");
    dbInstance = new Database(dbPath);
    
    // Use DELETE journal mode to avoid locked -shm file conflicts with Turbopack file watcher on Windows
    dbInstance.pragma("journal_mode = DELETE");
    dbInstance.pragma("foreign_keys = ON");
    return dbInstance;
  } catch (error) {
    console.error("Erro ao inicializar conexão better-sqlite3:", error);
    throw error;
  }
}
