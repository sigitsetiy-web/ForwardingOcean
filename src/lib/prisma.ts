import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL || "";

  // If no valid connection string, create client without adapter (will fail on queries)
  if (!connectionString || connectionString.includes("[YOUR-PASSWORD]")) {
    console.warn(
      "⚠️  DATABASE_URL not configured. Database queries will fail."
    );
    // Return a PrismaClient that will throw on actual queries
    return new PrismaClient({
      adapter: new PrismaPg(
        new Pool({ connectionString: "postgresql://localhost:5432/fms_dev" })
      ),
    });
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : [],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
