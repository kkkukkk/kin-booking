import React from "react";
import clsx from "clsx";
import styles from "@/css/module/input.module.css";
import { InputProps } from "@/types/ui/input";

const Input = ({
	type = "text",
	theme = "normal",
	variant = "box",
	error = false,
	fontSize,
	fontWeight,
	className,
	...rest
}: InputProps) => {
	return (
		<input
			type={type}
			{...rest}
			className={clsx(
				styles["input-base"],
				styles[`theme-${theme}`],
				styles[`${variant}`],
				fontSize,
				fontWeight,
				error && styles["error"], // 에러 스타일
				"pl-2 py-1 w-full",
				className
			)}
		/>
	);
};

Input.displayName = "Input";

export default Input;