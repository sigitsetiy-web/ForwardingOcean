import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgres://postgres:Bismillah%40123Pass@db.yeadywoaxbnjiwsnmnpb.supabase.co:5432/postgres",
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Create branches
  const smg = await prisma.branch.upsert({
    where: { code: "SMG" },
    update: {},
    create: { code: "SMG", name: "Semarang", city: "Semarang", address: "Jl. Pemuda No. 123", phone: "024-1234567", pic: "Budi Santoso" },
  });

  const jkt = await prisma.branch.upsert({
    where: { code: "JKT" },
    update: {},
    create: { code: "JKT", name: "Jakarta", city: "Jakarta", address: "Jl. Sudirman No. 456", phone: "021-7654321", pic: "Andi Wijaya" },
  });

  const sby = await prisma.branch.upsert({
    where: { code: "SBY" },
    update: {},
    create: { code: "SBY", name: "Surabaya", city: "Surabaya", address: "Jl. Basuki Rahmat No. 789", phone: "031-9876543", pic: "Dewi Lestari" },
  });

  console.log("Branches created:", smg.code, jkt.code, sby.code);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@keyocean.co.id" },
    update: {},
    create: {
      email: "admin@keyocean.co.id",
      name: "Admin Key Ocean",
      role: "OWNER",
      branchId: smg.id,
      phone: "08123456789",
    },
  });

  console.log("Admin user created:", admin.email);

  // Create sample users
  const users = [
    { email: "budi@keyocean.co.id", name: "Budi Santoso", role: "BRANCH_MANAGER" as const, branchId: smg.id },
    { email: "andi@keyocean.co.id", name: "Andi Wijaya", role: "BRANCH_MANAGER" as const, branchId: jkt.id },
    { email: "siti@keyocean.co.id", name: "Siti Rahayu", role: "SALES" as const, branchId: smg.id },
    { email: "rudi@keyocean.co.id", name: "Rudi Hartono", role: "CSO" as const, branchId: smg.id },
    { email: "lisa@keyocean.co.id", name: "Lisa Permata", role: "FINANCE" as const, branchId: smg.id },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }

  console.log("Sample users created:", users.length);
  console.log("\nSeed completed!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
