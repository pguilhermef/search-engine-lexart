# Search Engine de Produtos

Este projeto é um desafio técnico para desenvolvedores fullstack feitos pela [Lexart Labs](https://lexartlabs.com/). A ideia é criar um search-engine de produtos com dois dropdowns, onde é possível escolher a loja e a categoria para pesquisar os produtos.

## Funcionamento

Ao buscar por um produto, é feita uma requisição para o banco de dados no PlanetScale para verificar se há algum produto com o termo buscado já cadastrado. Caso não haja nenhum produto cadastrado, o sistema fará uma requisição à API do Mercado Livre, caso a requisição seja feita para a loja "Mercado Livre", ou fará uma requisição de web scraping na página do Buscapé, caso a requisição seja feita para a loja "Buscapé", e fará uma busca para ambos caso nenhuma das lojas sejam escolhidas específicamente.

O sistema retorna os produtos encontrados em uma tabela na página web, exibindo informações como nome, preço e loja onde o produto foi encontrado.

## Tecnologias Utilizadas

- <strong>Linguagem de programação:</strong> JavaScript, Typescript e Node.js
- <strong>Frameworks:</strong> Next.js, Express
- <strong>Banco de dados:</strong> Mysql (PlanetScale), Prisma (ORM)
- <strong>Organização e padronizaçãos:</strong> Prettier e ESLint
- <strong>Ferramentas DevOps:</strong> Git, Vercel
- <strong>Bibliotecas e módulos utilizados:</strong>
  - cheerio, puppeteer: para fazer web scraping na página do Buscapé.

## Visualização

<strong>Clique [aqui](https://search-engine-weld.vercel.app/) para ser redirecionado para uma página segura onde poderá testar visualmente a aplicação.</strong>
