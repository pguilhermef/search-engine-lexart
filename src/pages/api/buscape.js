import { PrismaClient } from '@prisma/client';

const puppeteer = require('puppeteer');

const prisma = new PrismaClient()


async function buscapeScraping(categorieToSearch, searchInput) {
  const buscapeUrl = 'https://www.buscape.com.br/';
  const products = [];
  let count = 0;


  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 });

  await page.goto(buscapeUrl, { waitUntil: 'domcontentloaded' })
  await page.type('.AutoCompleteStyle_input__HG105', searchInput);
  await page.click('.AutoCompleteStyle_submitButton__GkxPO')
  await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  await page.click('.Dropdown_Dropdown__yBuX5');
  
  const dropdownCategory = await page.$eval('.Dropdown_DropdownHeader__N3Zqc', element => element.innerText)
  if (dropdownCategory !== categorieToSearch) {
    await page.click(`[title="${categorieToSearch}"]`);
    await page.waitForNavigation({ waitUntil: 'domcontentloaded' })
  } 

  const links = await page.$$eval('.SearchCard_ProductCard_Inner__7JhKb', el => el.map(
    link => link.href
  ))

  for(const link of links){
    if (link === links[0] || count === 6) {
      continue;
    }

    console.log('Produto', count);

    await page.goto(link, { waitUntil: 'domcontentloaded' })

    const title = await page.$eval('.Title_Name__qQvSr', element => element.innerText)
    const photo = await page.$eval('.swiper-slide > img ', element => element.src)
    const description = await page.$$eval('.Description_GradientOverflow__ncmUo > div > p', elements => elements.map(element => element.innerText))
    const price = await page.$eval('.Price_ValueContainer__1U9ia', element => element.innerText)

    const product = {
      title: title.split(" ").slice(0, 4).join(" "),
      photo,
      description: `${description.join(' ').slice(0, 150)}...`,
      price,
      link,
      seller: 'buscape',
      category: categorieToSearch,
    }

    products.push(product)

    count++
  }

  await browser.close()

  return { message: null, products }
}

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

    console.log('Buscando produtos...');
    const productsInScrap = await buscapeScraping(categorieToSearch, searchInput);

    if (productsInScrap.message) {
      return res.status(400).json({ message: productsInScrap.message, products: [] });
    }

    const createdProducts = await prisma.product.createMany({
      data: productsInScrap.products,
    });

    console.log(`${createdProducts.count} produtos criados.`);
    return res.status(200).json({ message: null, products: productsInScrap.products });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
