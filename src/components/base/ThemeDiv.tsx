'use client'

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import clsx from 'clsx';
import styles from '@/css/module/theme-div.module.css';
import useRehydrated from "@/hooks/useIsRehydrated";

type ThemeDivProps = React.HTMLAttributes<HTMLDivElement>;

const ThemeDiv: React.FC<ThemeDivProps> = ({ children, className, ...rest }) => {
	const theme = useSelector((state: RootState) => state.theme.current);
	const rehydrated = useRehydrated();

	if (!rehydrated) return null;

	return (
		<div
			className={clsx(styles["theme-div"], styles[theme], className)}
			{...rest}
		>
			{children}
		</div>
	);
};

ThemeDiv.displayName = "ThemeDiv";

export default ThemeDiv;