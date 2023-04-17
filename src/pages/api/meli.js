import { PrismaClient } from '@prisma/client';
import freeMarketApi from  '../../utils/meliApi'

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
        seller: 'meli'
      },
    });

    if (productsInDatabase.length > 0) {
      return res.status(200).json({ message: null, products: productsInDatabase });
    }

    console.log('Searching products...');

    let productsFromApi = []

    try {
      productsFromApi = await freeMarketApi(categorieToSearch, searchInput);

      await prisma.product.createMany({
        data: productsFromApi.products,
      });
    } catch (error) {
      productsFromApi.products = []
    }

    return res.status(200).json({ message: null, products: productsFromApi.products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
