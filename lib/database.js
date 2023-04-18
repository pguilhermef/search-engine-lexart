import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function findProducts(category, searchInput) {
  return prisma.product.findMany({
    where: {
      category,
      description: {
      contains: searchInput,
      },
      seller: 'buscape',
    },
  });
}

export async function createProducts(products) {
  return prisma.product.createMany({
    data: products,
  });
}