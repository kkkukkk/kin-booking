import clsx from "clsx";
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
	const getBaseStyles = () => {
		return "focus:outline-none pl-2 py-1 w-full text-base";
	};

	// variant별
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

	// 테마별 (CSS 변수 포함)
	const getThemeStyles = () => {
		switch (theme) {
			case "normal":
				return "text-black bg-white/90 border border-black/20 placeholder:text-black/50 [--input-bg:white] [--input-text:black]";
			case "dark":
				return "text-gray-200 bg-black/80 border border-white/50 placeholder:text-white/50 [--input-bg:rgba(0,0,0,0.8)] [--input-text:#e5e5e5]";
			case "neon":
				return "text-gray-200 bg-black/80 border border-[var(--neon-cyan)]/50 placeholder:text-white/50 [--input-bg:rgba(0,0,0,0.8)] [--input-text:#e5e5e5]";
			default:
				return "text-black bg-white/90 border border-black/20 placeholder:text-black/50 [--input-bg:white] [--input-text:black]";
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
			type={type}
			{...rest}
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
};

Input.displayName = "Input";

export default Input;