import React from "react";
import { Theme } from "@/types/ui/theme";
import { NeonVariant } from "./neonVariant";

export type ButtonType = "default" | "hamburger";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	width?: string,
	height?: string,
	theme?: Theme,
	round?: boolean,
	variant?: ButtonType,
	on?: boolean,
	fontSize?: string,
	fontWeight?: string,
	padding?: string,
	reverse?: boolean,
	light?: boolean,
	neonVariant?: NeonVariant,
	key?: React.Key
}