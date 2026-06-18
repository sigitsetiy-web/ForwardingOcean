import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "postgres://postgres:Bismillah%40123Pass@db.ikhxkdmnnwekacuesoyy.supabase.co:5432/postgres",
  },
});
