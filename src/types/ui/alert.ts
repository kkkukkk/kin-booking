export type AlertType = "confirm" | "prompt";

export type IconType = "success" | "warning" | "error" | "info";

export interface AlertProps {
	type: AlertType;
	title: string;
	message: string;
	inputValue?: string;
	onChangeInput?: (value: string) => void;
	noCancel?: boolean;
	onConfirm: () => void;
	onCancel?: () => void;
}

export interface ToastState {
	isOpen: boolean;
	message: string;
	autoCloseTime?: number;
	iconType?: IconType;
}

