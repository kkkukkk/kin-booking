import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Theme } from "@/types/theme";

interface ThemeState {
	current: Theme
}

const initialState: ThemeState = {
	current: "normal",
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		setTheme: (state, action: PayloadAction<Theme>) => {
			state.current = action.payload
		},
	},
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;