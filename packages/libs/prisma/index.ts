// prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prismaDB: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prismaDB ??
  new PrismaClient({
    log: ['query'], // optional, logs queries
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaDB = prisma;
