'use client'

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import clsx from "clsx";
import styles from '@/css/module/card.module.css';
import ThemeDiv from "@/components/base/ThemeDiv";

const Card = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	const currentTheme = useSelector((state: RootState) => state.theme.current);

	return (
		<ThemeDiv
			className={clsx(
				"relative",
				styles.card,
				currentTheme && styles[currentTheme],
				className
			)}
		>
			{children}
		</ThemeDiv>
	);
};

export default Card;