'use client';

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import clsx from 'clsx';
import styles from '@/css/module/theme-div.module.css';
import useRehydrated from '@/hooks/useIsRehydrated';

type ThemeDivProps = React.HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode;
	isChildren?: boolean;
};

const ThemeDiv = ({ children, className, isChildren, ...rest }: ThemeDivProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const rehydrated = useRehydrated();

	if (!rehydrated) return null;

	return (
		<div
			className={clsx(
				styles['theme-div'],
				styles[theme],
				isChildren && styles['is-children'],
				className
			)}
			{...rest}
		>
			{children}
		</div>
	);
};

ThemeDiv.displayName = 'ThemeDiv';

export default ThemeDiv;