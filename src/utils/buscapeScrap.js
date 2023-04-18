const puppeteer = require('puppeteer');
import cheerio from 'cheerio';

export default async function buscapeScraping(categorieToSearch, searchInput) {
  const products = [];
  let count = 0;

  let categoryId = 0;
  const tvId = 3;
  const cellId = 7;
  const refrigeratorId = 8;

  switch (categorieToSearch) {
    case 'Geladeira':
      categoryId = refrigeratorId;
      break;
    case 'TV':
      categoryId = tvId;
      break;
    case 'Celular':
      categoryId = cellId;
      break;
    default:
      console.log('Error on category search');
  }

  const buscapeUrl = `https://www.buscape.com.br/search?q=${searchInput}&refinements%5B0%5D%5Bid%5D=categoryId&refinements%5B0%5D%5Bvalues%5D%5B0%5D=${categoryId}&isDealsPage=false`

  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setViewport({ width: 1200, height: 800 });

  await page.goto(buscapeUrl, { waitUntil: 'domcontentloaded' })

  const links = await page.$$eval('.SearchCard_ProductCard_Inner__7JhKb', el => el.map(
    link => link.href
  ))

  for(const link of links){
    if (link === links[0] || count === 10) {
      continue;
    }

    await page.goto(link, { waitUntil: 'domcontentloaded' })

    const html = await page.content();
    const $ = cheerio.load(html);

    const title = $('.Title_Name__qQvSr').text()
    const photo = $('.swiper-slide > img ').attr('src')
    const description = $('.Description_GradientOverflow__ncmUo > div > p').map((_, element) => $(element).text()).get()
    const price = $('.Price_ValueContainer__1U9ia').text()

    const product = {
      title: title.split(' ').slice(0, 4).join(' '),
      photo,
      description: `${description.join(' ').split(' ').slice(0, 22).join(' ')}...`,
      price: `${price}`,
      link,
      seller: 'buscape',
      category: categorieToSearch,
    }

    products.push(product)

    count++
  }

  console.log(`${count} products founded!`)

  await browser.close()

  return { message: null, products }
}
