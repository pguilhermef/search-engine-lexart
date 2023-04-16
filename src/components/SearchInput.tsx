import React, { useState } from 'react'

type Props = {
  placeholder: string;
  value: string;
  onChange: (selectedOption: string) => void;
}

export default function SearchInput({placeholder, value, onChange}: Props) {
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedOption = event.target.value;
    onChange(selectedOption);
  };
  
  return (
    <div>
      <input
        type="text"
        name="search"
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        className="rounded-md border-2 border-black shadow-sm px-4 py-2"
      />
    </div>
  )
}