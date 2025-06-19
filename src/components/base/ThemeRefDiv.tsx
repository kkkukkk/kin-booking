'use client'

import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import styles from '@/css/module/theme-div.module.css';
import useRehydrated from '@/hooks/useIsRehydrated';

type ThemeDivProps = React.HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode;
	isChildren?: boolean;
};

const ThemeRefDiv = forwardRef<HTMLDivElement, ThemeDivProps>(
	({ children, className, isChildren, ...rest }, ref) => {
		const theme = useAppSelector((state: RootState) => state.theme.current);
		const rehydrated = useRehydrated();

		if (!rehydrated) return null;

		return (
			<div
				ref={ref}
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
	}
);

ThemeRefDiv.displayName = 'ThemeRefDiv';

export default ThemeRefDiv;