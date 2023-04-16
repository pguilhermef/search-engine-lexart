import React, { useState } from 'react'

type Props = {
  dropdownGroupName: string;
  selectedOption: string;
  options: string[];
  onChange: (selectedOption: string) => void;
}

export default function Dropdown({dropdownGroupName, selectedOption, options, onChange}: Props) {
  const handleSeller = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    onChange(selectedOption);
  };
  
  return (
    <div>
      <label htmlFor="category" className="sr-only">
        Websites
      </label>
      <select
      value={selectedOption}
      onChange={handleSeller}
      className="rounded-md border-gray-300 shadow-sm text-white bg-indigo-800 hover:bg-indigo-600 px-4 py-2"
      >
        <option value="" disabled hidden>
          {dropdownGroupName}
        </option>
        {options.map((selectedOption) => (
          <option
          key={selectedOption}
          value={selectedOption}
          className="text-black bg-white hover:bg-slate-400"
          >
            {selectedOption}
          </option>
        ))}
      </select>
    </div>
  )
}