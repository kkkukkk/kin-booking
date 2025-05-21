import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
	return (
		<button
			{...props}
			className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
		/>
	);
};