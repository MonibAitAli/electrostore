import "server-only";
import path from "node:path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

function resolveDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL;
  if (!raw) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.");
  }
  if (!raw.startsWith("file:")) {
    return raw;
  }
  const target = raw.slice("file:".length);
  if (path.isAbsolute(target)) {
    return raw;
  }
  // The segment genuinely comes from DATABASE_URL, so it cannot be statically
  // scoped; without the hint Turbopack traces the whole project into the output.
  return `file:${path.join(/* turbopackIgnore: true */ process.cwd(), target)}`;
}

function createClient() {
  const adapter = new PrismaLibSql({ url: resolveDatabaseUrl() });
  return new PrismaClient({ adapter });
}

// Next.js hot-reloads modules in dev; without this global we would leak a new
// connection pool on every edit until SQLite refuses writes.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createClient>;
};

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
