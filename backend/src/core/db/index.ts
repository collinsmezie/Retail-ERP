import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export async function connectDb() {
  try {
    await prisma.$connect();
    console.log('Prisma SQLite connection established');
  } catch (error) {
    console.error('Prisma connection failed:', error);
    throw error;
  }
}

export async function disconnectDb() {
  await prisma.$disconnect();
} 