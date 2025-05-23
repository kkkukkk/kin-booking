import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Theme = "normal" | "dark" | "neon";

interface ThemeState {
	current: Theme | null
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