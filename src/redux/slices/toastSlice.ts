import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ToastState, IconType } from "@/types/ui/alert";

const initialState: ToastState = {
	isOpen: false,
	message: "",
	autoCloseTime: undefined,
	iconType: undefined,
};

const toastSlice = createSlice({
	name: "toast",
	initialState,
	reducers: {
		showToast: (
			state,
			action: PayloadAction<{
				message: string;
				autoCloseTime?: number;
				iconType?: IconType;
			}>
		) => {
			state.isOpen = true;
			state.message = action.payload.message;
			state.iconType = action.payload.iconType;
			state.autoCloseTime = action.payload.autoCloseTime;
		},
		hideToast: (state) => {
			state.isOpen = false;
			state.message = '';
			state.iconType = undefined;
			state.autoCloseTime = undefined;
		},
	},
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;