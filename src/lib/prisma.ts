import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "";

  if (!dbUrl || dbUrl.includes("[YOUR")) {
    console.warn("⚠️ DATABASE_URL not configured");
    // Return client that will fail gracefully
    const pool = new Pool({ connectionString: "postgresql://localhost:5432/fms_dev" });
    return new PrismaClient({ adapter: new PrismaPg(pool) });
  }

  // For Supabase, construct pool with explicit config to avoid URL parsing issues
  let pool: Pool;
  
  try {
    // Try direct env vars first (most reliable on Vercel)
    if (process.env.DB_HOST) {
      pool = new Pool({
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || "5432"),
        database: process.env.DB_NAME || "postgres",
        user: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "",
        ssl: { rejectUnauthorized: false },
      });
    } else {
      // Fallback to URL
      pool = new Pool({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
    }
  } catch {
    // Last resort: hardcoded for this project
    pool = new Pool({
      host: "db.yeadywoaxbnjiwsnmnpb.supabase.co",
      port: 5432,
      database: "postgres",
      user: "postgres",
      password: "Bismillah@123Pass",
      ssl: { rejectUnauthorized: false },
    });
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
