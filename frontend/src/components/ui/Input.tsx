import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      className={`w-full px-4 py-3 bg-black border border-gray-800 rounded-lg text-white 
        focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}