import React from "react";
import clsx from "clsx";
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
	const getThemeStyles = () => {
		switch (theme) {
			case "normal":
				return "text-black bg-white/90 border border-black/20";
			case "dark":
				return light 
					? "text-[#eee] bg-[rgba(64,64,64,0.9)] border border-white/30"
					: "text-[#eee] bg-black/80 border border-white/30";
			case "neon":
				return "text-[rgb(119,255,153)] bg-black/80 border border-[rgb(119,255,153)]/30";
			default:
				return "text-black bg-white/90 border border-black/20";
		}
	};

	const getHoverStyles = () => {
		if (theme === "normal") {
			return reverse 
				? "hover:shadow-[0_0_4px_rgba(255,255,255,0.7),0_0_8px_rgba(255,255,255,0.5),0_0_12px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1)]"
				: "hover:shadow-[0_0_4px_rgba(0,0,0,0.5),0_0_8px_rgba(0,0,0,0.3),0_0_20px_rgba(0,0,0,0.1)]";
		}
		if (theme === "dark") {
			return reverse
				? "hover:shadow-[0_0_4px_rgba(0,0,0,0.5),0_0_8px_rgba(0,0,0,0.3),0_0_20px_rgba(0,0,0,0.1)]"
				: "hover:shadow-[0_0_4px_rgba(255,255,255,0.7),0_0_8px_rgba(255,255,255,0.5),0_0_12px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1)]";
		}
		if (theme === "neon") {
			return "hover:shadow-[0_0_4px_rgba(119,255,153,0.7),0_0_8px_rgba(119,255,153,0.5),0_0_12px_rgba(119,255,153,0.3),0_0_20px_rgba(119,255,153,0.2)]";
		}
		return "";
	};

	const getOnStyles = () => {
		if (!on) return "";
		
		if (theme === "normal") {
			return reverse 
				? "shadow-[0_0_4px_rgba(255,255,255,0.7),0_0_8px_rgba(255,255,255,0.5),0_0_12px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1)]"
				: "shadow-[0_0_4px_rgba(0,0,0,0.5),0_0_8px_rgba(0,0,0,0.3),0_0_20px_rgba(0,0,0,0.1)]";
		}
		if (theme === "dark") {
			return reverse
				? "shadow-[0_0_4px_rgba(0,0,0,0.5),0_0_8px_rgba(0,0,0,0.3),0_0_20px_rgba(0,0,0,0.1)]"
				: "shadow-[0_0_4px_rgba(255,255,255,0.7),0_0_8px_rgba(255,255,255,0.5),0_0_12px_rgba(255,255,255,0.3),0_0_20px_rgba(255,255,255,0.1)]";
		}
		if (theme === "neon") {
			return "shadow-[0_0_4px_rgba(119,255,153,0.7),0_0_8px_rgba(119,255,153,0.5),0_0_12px_rgba(119,255,153,0.3),0_0_20px_rgba(119,255,153,0.2)]";
		}
		return "";
	};

	const baseClass = clsx(
		"transition-all duration-300 cursor-pointer",
		"relative flex items-center justify-center",
		round ? "rounded-full w-[42px] h-[42px] md:w-[56px] md:h-[56px]" : ["rounded-[5px]", width, height],
		fontSize,
		fontWeight,
		padding,
		getThemeStyles(),
		getHoverStyles(),
		getOnStyles(),
		className
	);

	// 모바일에서 hover 효과 비활성화를 위한 클래스
	const mobileHoverClass = on ? "" : "max-md:hover:shadow-none";

	if (variant === "hamburger") {
		return (
			<button {...rest} className={clsx(baseClass, mobileHoverClass)} aria-pressed={on}>
				<HamburgerLines on={on} />
			</button>
		);
	}

	return <button {...rest} className={clsx(baseClass, mobileHoverClass)} aria-pressed={on} />;
};

Button.displayName = "Button";

export default Button;