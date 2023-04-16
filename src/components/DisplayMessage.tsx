import IMessages from '@/interfaces/IMessages';
import React, { useState } from 'react'

type Props = {
  message: string
}

const messages: IMessages = {
  'initial': 'Search for a product!',
  'searching': 'Searching for products, please wait a few seconds.',
  'errorInSearch': 'Error during search, please try again or try a different term'
};

export default function DisplayMessage({message}: Props) {
  

  return (
    <div className='mt-40 p-5'>
      {messages[message]}
    </div>
  )
} 