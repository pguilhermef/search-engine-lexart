const chromium = require('chrome-aws-lambda');
const chrome = process.env.AWS_LAMBDA_FUNCTION_VERSION ? require('chrome-aws-lambda') : {};

const tvId = 3;
const cellId = 7;
const refrigeratorId = 8;

const categoryIds = {
  Geladeira: refrigeratorId,
  TV: tvId,
  Celular: cellId,
};

const defaultViewport = { width: 1200, height: 800 };
const args = [...chrome.args, "--hide-scrollbars", "disable-web-security"];

export default async function buscapeScraping(categorieToSearch, searchInput) {
  const products = [];
  let count = 0;

  const categoryId = categoryIds[categorieToSearch];

  const options = process.env.AWS_LAMBDA_FUNCTION_VERSION
    ? {
        args,
        defaultViewport,
        executablePath: await chromium.executablePath,
        headless: true,
        ignoreHTTPSErrors: true,
      }
    : {};

  const buscapeUrl = `https://www.buscape.com.br/search?q=${searchInput}&refinements%5B0%5D%5Bid%5D=categoryId&refinements%5B0%5D%5Bvalues%5D%5B0%5D=${categoryId}&isDealsPage=false`;

  const puppeteer = process.env.AWS_LAMBDA_FUNCTION_VERSION ? require("puppeteer-core") : require("puppeteer");
  const browser = await puppeteer.launch(options);

  const page = await browser.newPage();
  await page.goto(buscapeUrl, { waitUntil: 'domcontentloaded' });

  const links = await page.$$eval('.SearchCard_ProductCard_Inner__7JhKb', el => el.map(link => link.href));

  for (const link of links) {
    if (link === links[0] || count === 10) {
      continue;
    }

    await page.goto(link, { waitUntil: 'domcontentloaded' });

    const title = await page.$eval('.Title_Name__qQvSr', element => element.innerText);
    const photo = await page.$eval('.swiper-slide > img ', element => element.src);
    const description = await page.$$eval('.Description_GradientOverflow__ncmUo > div > p', elements => elements.map(element => element.innerText));
    const price = await page.$eval('.Price_ValueContainer__1U9ia', element => element.innerText);

    const product = {
      title: title.split(' ').slice(0, 4).join(' '),
      photo,
      description: `${description.join(' ').split(' ').slice(0, 22).join(' ')}...`,
      price: `${price}`,
      link,
      seller: 'buscape',
      category: categorieToSearch,
    };

    products.push(product);
    count++;
  }

  console.log(`${count} products found!`);

  await browser.close();

  return { message: null, products };
}
