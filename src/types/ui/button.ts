import React from "react";
import {Theme} from "@/types/ui/theme";

export type ButtonType = "default" | "hamburger";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
	widthPx?: string;
	heightPx?: string;
	theme?: Theme;
	round?: boolean;
	variant?: ButtonType;
	on?: boolean;
	fontSize?: string;
	fontWeight?: string;
	padding?: string;
	reverse?: boolean;
};