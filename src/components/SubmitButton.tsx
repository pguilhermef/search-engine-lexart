import React from 'react';

type Props = {
  placeholder: string;
  onChange: React.MouseEventHandler<HTMLButtonElement>;
}

export default function SubmitButton({placeholder, onChange}: Props) {
  const handleInput = (event: React.MouseEvent<HTMLButtonElement>) => {
    onChange(event);
  };
  
  return (
    <div>
      <button
        type="button"
        onClick={handleInput}
        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-800 hover:bg-indigo-600 focus:outline-none"
      >
        { placeholder }
      </button>
    </div>
  );
}
