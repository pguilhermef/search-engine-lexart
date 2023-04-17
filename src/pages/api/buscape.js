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
        description: {
          contains: searchInput,
        },
        seller: 'buscape',
      },
    });

    if (productsInDatabase.length > 0) {
      return res.status(200).json({ message: null, products: productsInDatabase });
    }

    console.log('Searching products...');

    let productsInScrap = []

    try {
      productsInScrap = await buscapeScraping(categorieToSearch, searchInput);
      await prisma.product.createMany({
        data: productsInScrap.products,
      });
    } catch (error) {
      productsInScrap.products = [];
    }


    return res.status(200).json({ message: null, products: productsInScrap.products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
