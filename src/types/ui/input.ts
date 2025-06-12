import React from "react";
import { Theme } from "@/types/ui/theme";

export type VariantType = "box" | "underline";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	type?: string;
	theme?: Theme;
	variant?: VariantType;
	fontSize?: string;
	fontWeight?: string;
	padding?: string;
	className?: string;
	error?: boolean;
}