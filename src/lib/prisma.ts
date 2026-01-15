
// @ts-ignore
import { PrismaClient } from '@prisma/client';

// Evita múltiplas instâncias do Prisma no Hot Reload em desenvolvimento
// e garante uma conexão estável em produção na HostGator.
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['error', 'warn'], // Reduz logs em produção para economizar I/O
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
