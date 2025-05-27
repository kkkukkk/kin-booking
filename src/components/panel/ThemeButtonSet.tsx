"use client";
import React from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { setTheme } from "@/redux/slices/themeSlice";
import clsx from "clsx";
import Button from "@/components/base/Button";
import ThemeDiv from "@/components/base/ThemeDiv";

type ThemeButtonSetProps = {
	isOpen: boolean;
};

const ThemeButtonSet = ({ isOpen }: ThemeButtonSetProps) => {
	const dispatch = useAppDispatch();
	const currentTheme = useAppSelector((state: RootState) => state.theme.current);

	const handleClick = (theme: "normal" | "dark" | "neon") => {
		dispatch(setTheme(theme));
	};

	return (
		<ThemeDiv
			className={clsx(
				"flex flex-col gap-2 p-2 rounded-full shadow-md",
				"absolute bottom-full mb-2 left-1/2 -translate-x-1/2",
				"transition-all duration-300 ease-out",
				isOpen
					? "opacity-100 scale-100 pointer-events-auto"
					: "opacity-0 scale-95 pointer-events-none"
			)}
			style={{
				width: "fit-content",
			}}
		>
			{(["normal", "dark", "neon"] as const).map((theme) => (
				<Button
					key={theme}
					type="button"
					theme={theme}
					onClick={() => handleClick(theme)}
					className={currentTheme === theme ? "on" : ""}
					round
					on={currentTheme === theme}
				>
					{theme.charAt(0).toUpperCase() + theme.slice(1)}
				</Button>
			))}
		</ThemeDiv>
	);
};

export default ThemeButtonSet;