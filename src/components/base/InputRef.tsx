import React from "react";
import clsx from "clsx";
import { InputProps } from "@/types/ui/input";

const InputRef = React.forwardRef<HTMLInputElement, InputProps>(
	({ theme = "normal", variant = "box", error = false, fontSize, fontWeight, className, ...rest }, ref) => {
		const getBaseStyles = () => {
			return "focus:outline-none pl-2 py-1 w-full";
		};

		// variant 별
		const getVariantStyles = () => {
			switch (variant) {
				case "box":
					return "rounded-[5px] shadow-[1px_1px_0_1px_rgba(0,0,0,0.1)]";
				case "underline":
					return "bg-transparent border-none rounded-none";
				default:
					return "rounded-[5px] shadow-[1px_1px_0_1px_rgba(0,0,0,0.1)]";
			}
		};

		// 테마 별
		const getThemeStyles = () => {
			switch (theme) {
				case "normal":
					return "text-black bg-white/90 border border-black/20 placeholder:text-black/50";
				case "dark":
					return "text-gray-200 bg-black/80 border border-white/50 placeholder:text-white/50";
				case "neon":
					return "text-gray-200 bg-black/80 border border-white/50 placeholder:text-white/50";
				default:
					return "text-black bg-white/90 border border-black/20 placeholder:text-black/50";
			}
		};

		// underline variant + 테마 조합
		const getUnderlineThemeStyles = () => {
			if (variant !== "underline") return "";
			
			switch (theme) {
				case "normal":
					return "rounded-t-[5px] bg-white/50 border-b-2 border-black/70";
				case "dark":
					return "border-b border-white/70";
				case "neon":
					return "border-b border-[rgba(119,255,153,0.5)]";
				default:
					return "rounded-t-[5px] bg-white/50 border-b-2 border-black/70";
			}
		};

		// 에러 스타일
		const getErrorStyles = () => {
			if (!error) return "";
			return "border border-red-500/30 shadow-[0_0_4px_rgba(255,0,0,0.5),0_0_8px_rgba(255,0,0,0.3)]";
		};

		return (
			<input
				{...rest}
				ref={ref}
				className={clsx(
					getBaseStyles(),
					getVariantStyles(),
					getThemeStyles(),
					getUnderlineThemeStyles(),
					getErrorStyles(),
					fontSize,
					fontWeight,
					className
				)}
			/>
		);
	}
);

InputRef.displayName = "InputRef";

export default InputRef;