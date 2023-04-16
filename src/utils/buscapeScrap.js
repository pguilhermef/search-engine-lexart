const puppeteer = require('puppeteer');

export default async function buscapeScraping(categorieToSearch, searchInput) {
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

  console.log(`${count} products founded!`)

  await browser.close()

  return { message: null, products }
}