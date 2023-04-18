import buscapeScraping from  '../../utils/buscapeScrap'
import { findProducts, createProducts } from '../../../lib/database'

export default async function handler(req, res) {
  const { categorieToSearch, searchInput } = req.query;

  try {
    const productsInDatabase = await findProducts(categorieToSearch, searchInput)

    console.log('Searching products in database...');

    if (productsInDatabase.length > 0) {
      return res.status(200).json({ message: null, products: productsInDatabase });
    }

    console.log('Searching products in web...');

    let productsInScrap = []

    try {
      productsInScrap = await buscapeScraping(categorieToSearch, searchInput);
      await createProducts(productsInScrap.products)
    } catch (error) {
      productsInScrap.products = [];
    }

    return res.status(200).json({ message: null, products: productsInScrap.products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
