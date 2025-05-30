'use client'

import React from "react";
import { useAppSelector } from "@/redux/hooks";
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
	const currentTheme = useAppSelector((state: RootState) => state.theme.current);

	return (
		<ThemeDiv
			className={clsx(
				"relative main-center",
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