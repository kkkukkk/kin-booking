import React from "react";
import clsx from "clsx";
import styles from "@/css/module/button.module.css";

type ThemeType = "normal" | "dark" | "neon";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	widthPx?: number;
	heightPx?: number;
	fontSizePx?: number;
	theme?: ThemeType;
	round?: boolean;
	variant?: "default" | "hamburger";
	on?: boolean; // 활성화 / 열림 상태 모두 표현
};

const Button = ({
	widthPx = 42,
	heightPx = 42,
	fontSizePx = 10,
	theme = "normal",
	round = false,
	variant = "default",
	on = false,
	className,
	style,
	...rest
}: ButtonProps) => {
	if (variant === "hamburger") {
		return (
			<button
				{...rest}
				className={clsx(
					styles["btn-base"],
					styles[`theme-${theme}`],
					round && styles["round"],
					className,
					"relative flex items-center justify-center"
				)}
				style={{
					width: widthPx,
					height: heightPx,
					fontSize: fontSizePx,
					...style,
				}}
				aria-pressed={on}
			>
				<span
					className={clsx(
						"absolute w-5 bg-current transition-all duration-300",
						"h-[2px]",          // 두께 4px로 변경
						on ? "rotate-45 top-1/2" : "top-1/2 -translate-y-2"  // 간격 조절 (위쪽 바)
					)}
					style={{transformOrigin: "center"}}
				/>
				<span
					className={clsx(
						"absolute w-5 bg-current transition-all duration-300",
						"h-[2px]",          // 두께 4px
						on ? "opacity-0" : "opacity-100",
						"top-1/2 -translate-y-1/2"  // 가운데 바 위치 유지
					)}
				/>
				<span
					className={clsx(
						"absolute w-5 bg-current transition-all duration-300",
						"h-[2px]",          // 두께 4px
						on ? "-rotate-45 top-1/2" : "top-1/2 translate-y-2"  // 간격 조절 (아래쪽 바)
					)}
					style={{transformOrigin: "center"}}
				/>
			</button>
		);
	}

	return (
		<button
			{...rest}
			className={clsx(
				styles["btn-base"],
				styles[`theme-${theme}`],
				round && styles["round"],
				on && styles["on"],
				"relative flex items-center justify-center",
				className
			)}
			style={{
				width : widthPx,
				height: heightPx,
				fontSize: fontSizePx,
				...style,
			}}
		/>
	);
};

export default Button;