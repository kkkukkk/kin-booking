import React from "react";
import ThemeButtonSet from "./ThemeButtonSet";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import '@/css/card.css';

const Card = ({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	const currentTheme = useSelector((state: RootState) => state.theme.current);

	const themeClass = currentTheme === "neon" ? "dark neon" : currentTheme;

	return (
		<div className={`relative card ${themeClass} ${className}`}>
			<ThemeButtonSet />
			{children}
		</div>
	);
};

export default Card;