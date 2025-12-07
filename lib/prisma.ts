// Nota: Este arquivo será usado quando você instalar o Next.js e o @prisma/client
// Por enquanto, ele serve como estrutura preparada.

/*
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
*/

// Mock export para não quebrar a compilação atual sem node_modules
export const prisma = null;
