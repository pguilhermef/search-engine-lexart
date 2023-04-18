const chromium = require('chrome-aws-lambda');

let chrome = {}
let puppeteer;

if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
  chrome = require('chrome-aws-lambda')
  puppeteer = require("puppeteer-core")
} else {
  puppeteer = require("puppeteer")
}

export default async function buscapeScraping(categorieToSearch, searchInput) {
  const products = [];
  let count = 0;

  let options = {}

  if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
    options = {
      args: [...chrome.args, "--hide-scrollbars", "disable-web-security"],
      defaultViewport: ({ width: 1200, height: 800 }),
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    };
  }

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

  let browser = await puppeteer.launch(options)

  let page = await browser.newPage();

  await page.goto(buscapeUrl, { waitUntil: 'domcontentloaded' })

  const links = await page.$$eval('.SearchCard_ProductCard_Inner__7JhKb', el => el.map(
    link => link.href
  ))

  for(const link of links){
    if (link === links[0] || count === 10) {
      continue;
    }

    await page.goto(link, { waitUntil: 'domcontentloaded' })

    const title = await page.$eval('.Title_Name__qQvSr', element => element.innerText)
    const photo = await page.$eval('.swiper-slide > img ', element => element.src)
    const description = await page.$$eval('.Description_GradientOverflow__ncmUo > div > p', elements => elements.map(element => element.innerText))
    const price = await page.$eval('.Price_ValueContainer__1U9ia', element => element.innerText)

    const product = {
      title: title.split(' ').slice(0, 4).join(' '),
      photo,
      description: `${description.join(' ').split(' ').slice(0, 22).join(' ')}...`,
      price: `${price}`,
      link,
      seller: 'buscape',
      category: categorieToSearch,
    }

    console.log(product);

    products.push(product)

    count++
  }

  console.log(`${count} products founded!`)

  await browser.close()

  return { message: null, products }
}