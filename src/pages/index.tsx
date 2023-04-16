import DisplayMessage from "@/components/DisplayMessage";
import IProduct from "@/interfaces/IProduct";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react"

import meliLogo from '../../public/logo-meli.png'
import buscapeLogo from '../../public/logo-buscape.png'


const categories = ['Geladeira', 'TV', 'Celular'];
const sellersOptions = ['Todas', 'Mercado Livre', 'Buscapé'];

export default function Home() {
  const [products, setProducts] = useState([]) 
  const [seller, setSeller] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false)
  const [message, setMessage] = useState('initial')

  useEffect(() => {
    if (isSearched) {
    setIsSearched(false)

    setMessage('searching')

    fetch(`/api/buscape?categorieToSearch=${encodeURIComponent(category)}&searchInput=${encodeURIComponent(searchQuery)}`)
      .then(response => response.json())
      .then(data => {
        if(!data){
          setProducts([])
        }
        setProducts(data.products)
      })
      .then(() => setMessage('errorInSearch'))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearched])

  const handleWebsiteChange = (event: React.ChangeEvent<EventTarget | HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setSeller(target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<EventTarget | HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setCategory(target.value);
  };

  const handleSearchChange = (event: React.ChangeEvent<EventTarget | HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setSearchQuery(target.value);
  };

  const handleSearchSubmit = () => {
    setIsSearched(!isSearched)
  };

  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col justify-start items-center bg-white border-4 border-black h-5/6 w-3/4 max-w-5xl">
        <div className="flex justify-center items-center my-10 gap-4 flex-wrap">
          <div>
            <label htmlFor="website" className="sr-only">
              Website
            </label>
            <select
              id="website"
              name="website"
              value={seller}
              onChange={handleWebsiteChange}
              className="rounded-md border-gray-300 shadow-sm text-white bg-indigo-800 hover:bg-indigo-600 px-4 py-2"
            >
              <option value="" disabled hidden>
                Web
              </option>
              {sellersOptions.map((option) => (
                <option key={option} value={option} className="text-black bg-white hover:bg-slate-400">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="sr-only">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={category}
              onChange={handleCategoryChange}
              className="rounded-md border-gray-300 shadow-sm text-white bg-indigo-800 hover:bg-indigo-600 px-4 py-2"
            >
              <option value="" disabled hidden>
                Categories
              </option>
              {categories.map((option) => (
                <option key={option} value={option} className="text-black bg-white hover:bg-slate-400">
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input
              type="text"
              name="search"
              placeholder="Search products"
              value={searchQuery}
              onChange={handleSearchChange}
              className="rounded-md border-2 border-black shadow-sm px-4 py-2"
            />
          </div>
          <div>
            <button
              type="button"
              onClick={handleSearchSubmit}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-800 hover:bg-indigo-600 focus:outline-none"
            >
              Search
            </button>
          </div>
        </div>
        { products.length > 0 ? (
          <div className="flex justify-center flex-wrap max-w-2xl h-4/6 overflow-y-scroll">
          {products.map((product: IProduct) => (
            <div key={product.id} className='my-5'>
              <div className='flex justify-center items-center'>
                {/* Image */}
                <div>
                  <div>
                    <Image
                      src={ product.seller === 'buscape' ? buscapeLogo : meliLogo }
                      alt={ `Logo of ${product.seller}` }
                      width={25}
                      height={25}
                      className='float-right'
                    />
                  </div>
                  <div>
                    <Image src={product.photo} alt={product.description} width={200} height={200}/>
                  </div>
                </div>
                {/* Infos */}
                <div className='flex flex-col items-start mx-5 gap-y-4'>
                  <div className='font-semibold text-xl'>
                    {/* here catch the first two words of name */}
                    {product.title}
                  </div>
                  <div className='max-w-[20rem]'>
                    {product.description}
                  </div>
                  <div className='font-semibold text-xl'>
                    {product.price}
                  </div>
                </div>
                {/* Button */}
                <div>
                  <Link href={product.link} target='_blank'>
                    <div
                      className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-800 hover:bg-indigo-600 focus:outline-none"
                      >
                      Search
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        ) : (
          <DisplayMessage message={message} />
        )}
      </div>
    </main>
  );
}
