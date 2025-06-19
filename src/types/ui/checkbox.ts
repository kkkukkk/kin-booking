
export interface CheckBoxProps {
	checked: boolean;
	onChange?: (checked: boolean) => void | undefined;
	required?: boolean;
}

export interface CheckBoxWithLabelProps extends CheckBoxProps {
	label?: string;
	required?: boolean;
}