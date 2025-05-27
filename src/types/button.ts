import React from "react";
import {Theme} from "@/types/theme";

export type ButtonType = "default" | "hamburger";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	widthPx?: number;
	heightPx?: number;
	fontSizePx?: number;
	theme?: Theme;
	round?: boolean;
	variant?: ButtonType;
	on?: boolean;
	reverse?: boolean;
};