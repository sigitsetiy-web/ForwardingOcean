import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPool(): Pool {
  // Use explicit DB vars (most reliable across all platforms)
  const host = process.env.DB_HOST;
  const port = parseInt(process.env.DB_PORT || "5432");
  const database = process.env.DB_NAME || "postgres";
  const user = process.env.DB_USER || "postgres";
  const password = process.env.DB_PASSWORD;

  if (!host || !password) {
    console.error("DB_HOST or DB_PASSWORD not set!");
    // Fallback — will fail but won't expose credentials in source
    return new Pool({ connectionString: process.env.DATABASE_URL || "", ssl: { rejectUnauthorized: false } });
  }

  return new Pool({
    host,
    port,
    database,
    user,
    password,
    ssl: { rejectUnauthorized: false },
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });
}

function createPrismaClient(): PrismaClient {
  const pool = getPool();
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
