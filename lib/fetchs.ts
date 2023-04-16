export function fetchMeli(category: string, searchInput: string) {
  const productsFromMeli = fetch(`/api/meli?categorieToSearch=${encodeURIComponent(category)}&searchInput=${encodeURIComponent(searchInput)}`)
    .then(response => response.json())
    .then(data => data.products)
  return productsFromMeli;
}

export function fetchBuscape(category: string, searchInput: string) {
  const productsFromBuscape = fetch(`/api/buscape?categorieToSearch=${encodeURIComponent(category)}&searchInput=${encodeURIComponent(searchInput)}`)
    .then(response => response.json())
    .then(data => data.products)
  return productsFromBuscape;
}