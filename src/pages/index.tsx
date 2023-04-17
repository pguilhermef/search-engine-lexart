import DisplayMessage from "@/components/DisplayMessage";
import IProduct from "@/interfaces/IProduct";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react"

import meliLogo from '../../public/logo-meli.png'
import buscapeLogo from '../../public/logo-buscape.png'
import { fetchBuscape, fetchMeli } from "../../lib/fetchs";
import Dropdown from "@/components/Dropdown";
import SearchInput from "@/components/SearchInput";
import SubmitButton from "@/components/SubmitButton";


const categories = ['Geladeira', 'TV', 'Celular'];
const websites = ['Todas', 'Mercado Livre', 'Buscapé'];

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]) 
  const [seller, setSeller] = useState('');
  const [category, setCategory] = useState('');
  const [searchInput, setSeachInput] = useState('');
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

        fetchMeli(category, searchInput)
          .then(products => setProducts(products))
          .then(() => setIsLoading(false))
        break;
      case 'Buscapé':
        setProducts([])

        fetchBuscape(category, searchInput)
          .then(products => setProducts(products))
          .then(() => setIsLoading(false))
        break;
      default:
        setProducts([])

        Promise.all([
          fetchMeli(category, searchInput),
          fetchBuscape(category, searchInput)
        ]).then(([meliProducts, buscapeProducts]) => {
          setProducts([...meliProducts, ...buscapeProducts] as IProduct[])
          setIsLoading(false)
        })
        break;
    } 
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearched])

  const handleSearchButtonClick = () => {
    setIsSearched(prevState => !prevState);
  };

  return (
    <main className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col justify-start items-center bg-white border-4 border-black h-5/6 w-3/4 max-w-5xl">
        <div className="flex justify-center items-center my-10 gap-4 flex-wrap">
          <Dropdown
            dropdownGroupName="websites"
            selectedOption={seller}
            options={websites}
            onChange={(e) => setSeller(e)}
          />
          <Dropdown
            dropdownGroupName="categories"
            selectedOption={category}
            options={categories}
            onChange={(e) => setCategory(e)}
          />
          <SearchInput
            placeholder={'Geladeira Samsung'}
            value={searchInput}
            onChange={(e) => setSeachInput(e)}
          />
          <SubmitButton placeholder="Pesquisar" onChange={handleSearchButtonClick}/>
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
