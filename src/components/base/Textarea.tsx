import React from "react";
import clsx from "clsx";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	theme?: "normal" | "dark" | "neon";
	error?: boolean;
	fontSize?: string;
	fontWeight?: string;
}

const Textarea = ({
	theme = "normal",
	error = false,
	fontSize,
	fontWeight,
	className,
	...rest
}: TextareaProps) => {
	// 기본 스타일
	const getBaseStyles = () => {
		return "focus:outline-none pl-2 py-1 w-full resize-none rounded-[5px] shadow-[1px_1px_0_1px_rgba(0,0,0,0.1)]";
	};

	// 테마별 스타일
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

	// 에러 스타일
	const getErrorStyles = () => {
		if (!error) return "";
		return "border border-red-500/30 shadow-[0_0_4px_rgba(255,0,0,0.5),0_0_8px_rgba(255,0,0,0.3)]";
	};

	return (
		<textarea
			{...rest}
			className={clsx(
				getBaseStyles(),
				getThemeStyles(),
				getErrorStyles(),
				fontSize,
				fontWeight,
				className
			)}
		/>
	);
};

Textarea.displayName = "Textarea";

export default Textarea; 