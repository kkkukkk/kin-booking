import React from "react";
import clsx from "clsx";
import styles from "@/css/module/button.module.css";

type ThemeType = "normal" | "dark" | "neon";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	widthPx?: number,
	heightPx?: number,
	fontSizePx?: number,
	theme?: ThemeType,
	round?: boolean,
};

export const Button = ({
	widthPx = 48,
	heightPx = 48,
	fontSizePx = 12,
	theme = "normal",
	round = false,
	className,
	style,
	...rest
}: ButtonProps) => {
	return (
		<button
			{...rest}
			className={clsx(
				styles["btn-base"],
				styles[`theme-${theme}`],
				round && styles["round"],   // round 클래스 조건부 추가
				className
			)}
			style={{
				width: widthPx,
				height: heightPx,
				fontSize: fontSizePx,
				...style,
			}}
		/>
	);
};