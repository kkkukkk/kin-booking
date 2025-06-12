import React from "react";
import clsx from "clsx";
import styles from "@/css/module/input.module.css";
import { InputProps } from "@/types/ui/input";

const InputRef = React.forwardRef<HTMLInputElement, InputProps>(
	({ theme = "normal", variant = "box", error = false, fontSize, fontWeight, className, ...rest }, ref) => {
		return (
			<input
				{...rest}
				ref={ref}
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
	}
);

InputRef.displayName = "InputRef";

export default InputRef;