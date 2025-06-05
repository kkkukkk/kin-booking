import React from "react";
import { Theme } from "@/types/ui/theme";

export type VariantType = "box" | "underline";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	theme?: Theme;
	variant?: VariantType;
	fontSize?: string;
	fontWeight?: string;
	padding?: string;
	className?: string;
	error?: boolean;
	placeholder?: string;
};