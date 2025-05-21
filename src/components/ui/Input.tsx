import React from "react";

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
	fullWidth?: boolean;
	size?: 'sm' | 'md' | 'lg';
	placeholder?: string;
};

export const Input = ({ fullWidth = true, size = 'md', className, ...props }: InputProps) => {
	const sizeClasses = {
		sm: 'px-2 py-1.5 text-sm',
		md: 'px-2 py-2 text-base',
		lg: 'px-2 py-2.5 text-lg',
	};

	return (
		<input
			{...props}
			className={`
				border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
		        ${fullWidth ? 'w-full' : ''}
		        ${sizeClasses[size]}
		        ${className ?? ''}
            `}
		/>
	);
};