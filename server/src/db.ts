import { PrismaClient } from "@prisma/client";

// This creates a global instance of Prisma Client
// It's best practice to prevent creating too many connections

export const prisma = globalThis.prisma || new PrismaClient();

// Check if we're not in production environment
if (process?.env?.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
