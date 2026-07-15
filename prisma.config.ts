import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations run against the direct (unpooled) connection.
    // In Neon this differs from the pooled DATABASE_URL the app uses at runtime.
    url: env("DIRECT_URL"),
  },
});
