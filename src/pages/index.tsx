import DisplayMessage from "@/components/DisplayMessage";
import IProduct from "@/interfaces/IProduct";

import { useEffect, useState } from "react"

import { fetchBuscape, fetchMeli } from "../../lib/fetchs";
import Dropdown from "@/components/Dropdown";
import SearchInput from "@/components/SearchInput";
import SubmitButton from "@/components/SubmitButton";
import ProductsList from "@/components/ProductsList";


const categories = ['Geladeira', 'TV', 'Celular'];
const websites = ['Todas', 'Mercado Livre', 'Buscapé'];

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]) 
  const [seller, setSeller] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [searchInput, setSeachInput] = useState<string>('');
  const [isSearched, setIsSearched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('initial')

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
            dropdownGroupName="Web"
            selectedOption={seller}
            options={websites}
            onChange={(e) => setSeller(e)}
          />
          <Dropdown
            dropdownGroupName="Categorias"
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

        {(!isLoading && products.length > 0) && <ProductsList products={products}/>}
      </div>
    </main>
  );
}
