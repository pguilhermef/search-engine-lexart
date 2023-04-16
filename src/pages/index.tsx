import DisplayMessage from "@/components/DisplayMessage";
import IProduct from "@/interfaces/IProduct";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react"

import meliLogo from '../../public/logo-meli.png'
import buscapeLogo from '../../public/logo-buscape.png'
import { fetchBuscape, fetchMeli } from "../../lib/fetchs";
import Dropdown from "@/components/Dropdown";


const categories = ['Geladeira', 'TV', 'Celular'];
const websites = ['Todas', 'Mercado Livre', 'Buscapé'];

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]) 
  const [seller, setSeller] = useState('');
  const [category, setCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearched, setIsSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('initial')

  useEffect(() => {
    if (isSearched) {
    setIsSearched(false)
    setMessage('searching')
    setIsLoading(true)

    switch (seller) {
      case 'Mercado Livre':
        setProducts([])

        fetchMeli(category, searchQuery)
          .then(products => setProducts(products))
          .then(() => setIsLoading(false))
        break;
      case 'Buscapé':
        setProducts([])

        fetchBuscape(category, searchQuery)
          .then(products => setProducts(products))
          .then(() => setIsLoading(false))
        break;
      default:
        setProducts([])

        Promise.all([
          fetchMeli(category, searchQuery),
          fetchBuscape(category, searchQuery)
        ]).then(([meliProducts, buscapeProducts]) => {
          setProducts([...meliProducts, ...buscapeProducts] as IProduct[])
          setIsLoading(false)
        })
        break;
    } 
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearched])

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
          <Dropdown sellerSelected={seller} websites={websites} onChange={(v) => setSeller(v)} />
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
              Pesquisar
            </button>
          </div>
        </div>
        { isLoading && <DisplayMessage message={message} /> }
        {(!isLoading && products.length > 0) && (
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
                      className="inline-flex items-center px-2 py-2 mx-4 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-800 hover:bg-indigo-600 focus:outline-none text-center"
                      >
                      Ir para web
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </main>
  );
}
