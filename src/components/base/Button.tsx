import React from "react";
import clsx from "clsx";
import styles from "@/css/module/button.module.css";
import { ButtonProps } from "@/types/ui/button";

// 햄버거 버튼 바
const HamburgerLines = ({ on }: { on: boolean }) => {
	return (
		<>
			<span
			  className={clsx(
			      "absolute w-5 bg-current transition-all duration-300 h-[2px]",
			      on ? "rotate-45 top-1/2" : "top-1/2 -translate-y-2"
			  )}
			  style={{ transformOrigin: "center" }}
			/>
			<span
				className={clsx(
					"absolute w-5 bg-current transition-all duration-300 h-[2px]",
					on ? "opacity-0" : "opacity-100",
					"top-1/2 -translate-y-1/2"
				)}
			/>
			<span
				className={clsx(
					"absolute w-5 bg-current transition-all duration-300 h-[2px]",
					on ? "-rotate-45 top-1/2" : "top-1/2 translate-y-2"
				)}
				style={{ transformOrigin: "center" }}
			/>
		</>
	);
};

const Button = ({
	width = "w-auto",
	height = "h-auto",
	theme = "normal",
	round = false,
	variant = "default",
	on = false,
	reverse = false,
	light = false,
	fontSize = "text-sm md:text-base",
	fontWeight = "font-medium",
	padding = "px-2 py-0",
	className,
	...rest
}: ButtonProps) => {
	const baseClass = clsx(
		styles[`theme-${theme}`],
		"transition-all duration-300 cursor-pointer",
		"relative flex items-center justify-center",
		round ? "rounded-full w-[42px] h-[42px] md:w-[56px] md:h-[56px]" : ["rounded-[5px]", width, height],
		fontSize,
		fontWeight,
		padding,
		on && styles["on"],
		reverse && styles["reverse"],
		light && styles["light"],
		className
	);

	if (variant === "hamburger") {
		return (
			<button {...rest} className={baseClass} aria-pressed={on}>
				<HamburgerLines on={on} />
			</button>
		);
	}

	return <button {...rest} className={baseClass} aria-pressed={on} />;
};

Button.displayName = "Button";

export default Button;