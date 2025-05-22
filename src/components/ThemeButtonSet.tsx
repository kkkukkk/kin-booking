"use client";
import React from "react";
import { Button } from "@/components/ui/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setTheme } from "@/redux/slices/themeSlice";

const ThemeButtonSet = () => {
	const dispatch = useDispatch();
	const currentTheme = useSelector((state: RootState) => state.theme.current);

	const handleClick = (theme: "normal" | "dark" | "neon") => {
		dispatch(setTheme(theme));
	};

	return (
		<div 
			style={{ backdropFilter: "blur(5px)", backgroundColor: "rgba(243,243,243,0.8)" }}
			className="absolute bottom-4 right-4 flex gap-4 bg-opacity-90 shadow-md p-3 rounded-lg"
		>
			{(["normal", "dark", "neon"] as const).map((theme) => (
				<Button
					key={theme}
					type="button"
					theme={theme}
					onClick={() => handleClick(theme)}
					className={currentTheme === theme ? "" : ""}
					round
				>
					{theme.charAt(0).toUpperCase() + theme.slice(1)}
				</Button>
			))}
		</div>
	);
};

export default ThemeButtonSet;