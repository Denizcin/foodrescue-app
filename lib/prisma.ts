import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

/**
 * Adds pgbouncer=true&connection_limit=5 to the connection string if not
 * already present. These params tell Neon's PgBouncer to use session-mode
 * pooling and cap the number of server-side connections.
 */
function buildConnectionString(url: string): string {
  try {
    const u = new URL(url);
    if (!u.searchParams.has("pgbouncer")) u.searchParams.set("pgbouncer", "true");
    if (!u.searchParams.has("connection_limit")) u.searchParams.set("connection_limit", "5");
    return u.toString();
  } catch {
    return url; // non-parseable URL (e.g. postgres://user:pass@host/db) — return as-is
  }
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  const pool = new Pool({
    connectionString: buildConnectionString(connectionString),
    max: 5,                      // match connection_limit — cap server-side connections
    connectionTimeoutMillis: 5_000,  // fail fast rather than hang
    idleTimeoutMillis: 10_000,   // release idle connections quickly (serverless keep-alive)
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
