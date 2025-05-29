import React from "react";
import { Theme } from "@/types/ui/theme";

export type VariantType = "box" | "underline";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
	theme?: Theme;
	variant?: VariantType;
	className?: string;
	error?: boolean;
};