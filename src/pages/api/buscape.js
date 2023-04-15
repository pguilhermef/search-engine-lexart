import { PrismaClient } from '@prisma/client';

const puppeteer = require('puppeteer');

const prisma = new PrismaClient()


async function buscapeScraping(categorieToSearch, searchInput) {
  const products = [];
  let count = 0;

  const buscapeUrl = 'https://www.buscape.com.br/';

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({
    width: 1200,
    height: 800,
  });

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

    const obj = {
      title,
      photo,
      description: "testando",
      price,
      link,
      seller: 'buscape',
      category: categorieToSearch,
    }

    products.push(obj)

    count++
  }

  await browser.close()

  return products
}

export default async function handler(req, res) {
  const { categorieToSearch, searchInput } = req.query;
  const { method } = req;

  if (!categorieToSearch || !searchInput) {
    res.status(400).json({ error: 'Parâmetros faltando na requisição.' });
    return;
  }

  if(method === 'GET'){
    let products = await prisma.product.findMany({
      where: {
        category: categorieToSearch,
        OR: {
          title: {
            contains: searchInput,
          },
          description: {
            contains: searchInput,
          }
        }
      }
    })

    if(!products.length){
      console.log('Buscando produtos...');
      products = await buscapeScraping(categorieToSearch, searchInput)

      let promises = products.map((p) => prisma.product.create({
        data: p
      }))

      await Promise.all(promises)

      console.log(promises);
    }

    return res.status(200).json(products)
  }
}
