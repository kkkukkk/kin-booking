import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertType, AlertProps } from "@/types/alert";

const initialState: AlertProps = {
	isOpen: false,
	type: "alert",
	message: "",
	inputValue: "",
	autoCloseTime: undefined,
};

const alertSlice = createSlice({
	name: "alert",
	initialState,
	reducers: {
		openAlert: (
			state,
			action: PayloadAction<{
				type: AlertType;
				message: string;
				inputValue?: string;
				autoCloseTime?: number;
			}>
		) => {
			state.isOpen = true;
			state.type = action.payload.type;
			state.message = action.payload.message;
			state.inputValue = action.payload.inputValue ?? "";
			state.autoCloseTime = action.payload.autoCloseTime;
		},
		closeAlert: (state) => {
			state.isOpen = false;
			state.message = "";
			state.inputValue = "";
			state.autoCloseTime = undefined;
		},
		setInputValue: (state, action: PayloadAction<string>) => {
			state.inputValue = action.payload;
		},
	},
});

export const { openAlert, closeAlert, setInputValue } = alertSlice.actions;

export default alertSlice.reducer;