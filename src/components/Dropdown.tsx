import React, { useState } from 'react'

type Props = {
  sellerSelected: string;
  websites: string[];
  onChange: (sellerSelected: string) => void;
}

export default function Dropdown({sellerSelected, websites, onChange}: Props) {
  const handleSeller = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sellerSelected = event.target.value;
    onChange(sellerSelected);
  };
  
  return (
    <div>
      <label htmlFor="category" className="sr-only">
        Websites
      </label>
      <select
      value={sellerSelected}
      onChange={handleSeller}
      className="rounded-md border-gray-300 shadow-sm text-white bg-indigo-800 hover:bg-indigo-600 px-4 py-2"
      >
        <option value="" disabled hidden>
          Websites
        </option>
        {websites.map((sellerSelected) => (
          <option
          key={sellerSelected}
          value={sellerSelected}
          className="text-black bg-white hover:bg-slate-400"
          >
            {sellerSelected}
          </option>
        ))}
      </select>
    </div>
  )
}