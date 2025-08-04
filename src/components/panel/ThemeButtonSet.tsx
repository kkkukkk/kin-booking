"use client";

import React, { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setTheme } from "@/redux/slices/themeSlice";
import clsx from "clsx";
import Button from "@/components/base/Button";
import ThemeDiv from "@/components/base/ThemeDiv";

type ThemeButtonSetProps = {
	isOpen: boolean;
};

// 공통 패널
const PANEL_STYLES = {
	base: "absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col gap-2 p-2 rounded-full shadow-md z-10000 transition-all duration-300 ease-out",
	open: "opacity-100 scale-100 pointer-events-auto",
	closed: "opacity-0 scale-95 pointer-events-none"
} as const;

const THEMES = ["normal", "dark", "neon"] as const;

const ThemeButtonSet = ({ isOpen }: ThemeButtonSetProps) => {
	const dispatch = useAppDispatch();
	const currentTheme = useAppSelector((state: RootState) => state.theme.current);

	const handleClick = useCallback((theme: "normal" | "dark" | "neon") => {
		dispatch(setTheme(theme));
	}, [dispatch]);

	return (
		<ThemeDiv
			className={clsx(
				"theme-button-set",
				PANEL_STYLES.base,
				isOpen ? PANEL_STYLES.open : PANEL_STYLES.closed
			)}
			style={{ width: "fit-content" }}
		>
			{THEMES.map((theme) => (
				<Button
					key={theme}
					type="button"
					theme={theme}
					onClick={() => handleClick(theme)}
					fontSize="text-[10px] md:text-xs"
					round
					on={currentTheme === theme}
					reverse={currentTheme !== theme}
				>
					{theme.charAt(0).toUpperCase() + theme.slice(1)}
				</Button>
			))}
		</ThemeDiv>
	);
};

export default ThemeButtonSet;