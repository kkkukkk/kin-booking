import { Theme } from "@/types/ui/theme";

export interface CheckBoxProps {
	theme?: Theme;
	checked: boolean;
	onChange?: (checked: boolean) => void | undefined;
	required?: boolean;
}

export interface CheckBoxWithLabelProps extends CheckBoxProps {
	label?: string;
	required?: boolean;
}