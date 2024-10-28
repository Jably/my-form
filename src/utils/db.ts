// src/utils/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createTransaction = async (orderId: string, amount: number, status: string, customerDetails: any) => {
  const transaction = await prisma.transaction.create({
    data: {
      orderId,
      amount,
      status,
      customerDetails: {
        create: customerDetails,
      },
    },
  });
  return transaction;
};

export const getTransactionById = async (id: number) => {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { customerDetails: true },
  });
  return transaction;
};

export const cancelTransaction = async (orderId: string) => {
  const transaction = await prisma.transaction.update({
    where: { orderId },
    data: { status: 'Cancelled' },
  });
  return transaction;
};

// Jangan lupa menutup koneksi Prisma saat aplikasi berhenti
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
