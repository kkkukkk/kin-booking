export type AlertType = "toast" | "confirm" | "alert" | "prompt"

export type AlertProps = {
	isOpen: boolean;
	type: AlertType;
	message: string,
	inputValue?: string,
	autoCloseTime?: number;
	onInputChange?: (value: string) => void;
	onConfirm?: (inputValue?: string) => void;
	onCancel?: () => void;
}