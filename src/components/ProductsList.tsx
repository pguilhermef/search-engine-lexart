import IProduct from '@/interfaces/IProduct';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import meliLogo from '../../public/logo-meli.png'
import buscapeLogo from '../../public/logo-buscape.png'

type Props = {
  products: IProduct[];
}

export default function ProductsList({products}: Props) {
  return (
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
  );
}
