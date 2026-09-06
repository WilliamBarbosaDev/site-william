import { getDatabase } from "./connection";
import { initSchema } from "./schema";
import { seedDatabase } from "./seed";

let initialized = false;

export async function getDb() {
  const db = getDatabase();
  if (!initialized) {
    initSchema();
    await seedDatabase();
    initialized = true;
  }
  return db;
}

export * from "./connection";
