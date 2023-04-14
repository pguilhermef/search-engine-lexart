// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient();

export default async function handler( req: NextApiRequest, res: NextApiResponse ){
  const { method } = req
  
  if (method === 'GET') {
    const products = await prisma.product.findMany();

    return res.status(200).json({ data: products }) 
  } else if (method === 'POST') {
    const { title, photo, description, price, link, seller, category } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        title,
        photo,
        description,
        price,
        link,
        seller,
        category,
      }
    })

    return res.status(201).json({ newProduct })
  }
}
