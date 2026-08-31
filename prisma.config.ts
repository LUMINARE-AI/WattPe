import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "Missing database URL. Set DIRECT_URL (migrations) or DATABASE_URL in a .env file — see .env.example.",
  );
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations run against the direct (unpooled) connection.
    // For local Postgres, DIRECT_URL and DATABASE_URL are usually the same.
    // On Neon, DIRECT_URL is the unpooled endpoint; DATABASE_URL is pooled.
    url: databaseUrl,
  },
});
