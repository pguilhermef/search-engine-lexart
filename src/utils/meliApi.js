export default async function freeMarketApi(categorieToSearch, searchInput) {
  let products = [];
  let categoryId = 0;

  const cellId = 'MLB1055'
  const refrigeratorId = 'MLB181294'
  const tvId = 'MLB1002'
  
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

  const meliUrl = `https://api.mercadolibre.com/sites/MLB/search?category=${categoryId}&q=${searchInput}`;

  try {
    const response = await fetch(meliUrl);
    const data = await response.json();
    const dataProducts = data.results;

    const productsPromises = dataProducts.map(async (e) => {
      const descriptionResponse = await fetch(`https://api.mercadolibre.com/items/${e.id}/description`);
      const descriptionData = await descriptionResponse.json();
      const produ = {
        title: e.title.split(' ').slice(0, 5).join(' '),
        photo: e.thumbnail,
        description: `${descriptionData.plain_text.split(' ').slice(0, 20).join(' ')}...`,
        price: `R$${String(e.price)}`,
        link: e.permalink,
        seller: 'meli',
        category: categorieToSearch,
      };

      return produ;
    });

    const products = (await Promise.all(productsPromises)).slice(0, 10);

    console.log(products.length);
    return { message: null, products };

  } catch (error) {
    console.error(error);
  }

  return { message: null, products };
};
