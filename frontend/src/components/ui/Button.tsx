import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    fullWidth?: boolean;
}

export function Button({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'py-3 font-bold rounded-full transition-colors';
    const variantStyles = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600',
        secondary: 'bg-transparent text-blue-500 hover:bg-blue-500/10'
    };
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}