import { PrismaClient } from '@prisma/client';
import buscapeScraping from  '../../utils/buscapeScrap'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { categorieToSearch, searchInput } = req.query;

  if (!categorieToSearch || !searchInput) {
    return res.status(400).json({ message: 'Parâmetros faltando na requisição.' });
  }

  try {
    const productsInDatabase = await prisma.product.findMany({
      where: {
        category: categorieToSearch,
        title: {
          contains: searchInput,
        },
      },
    });

    if (productsInDatabase.length > 0) {
      return res.status(200).json({ message: null, products: productsInDatabase });
    }

    console.log('Searching products...');
    const productsInScrap = await buscapeScraping(categorieToSearch, searchInput);

    if (productsInScrap.message) {
      return res.status(400).json({ message: productsInScrap.message, products: [] });
    }

    await prisma.product.createMany({
      data: productsInScrap.products,
    });

    return res.status(200).json({ message: null, products: productsInScrap.products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
