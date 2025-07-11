'use client';

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import clsx from 'clsx';
import useRehydrated from '@/hooks/useIsRehydrated';

type ThemeDivProps = React.HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode;
	isChildren?: boolean;
	lightweight?: boolean;
};

const ThemeDiv = ({ children, className, isChildren, lightweight = false, ...rest }: ThemeDivProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const rehydrated = useRehydrated();

	if (!rehydrated) return null;

	// 테마별 스타일 정의
	const themeStyles = {
		normal: {
			base: 'bg-[var(--normal-back)] border border-[rgba(0,0,0,0.2)] text-gray-900',
			children: 'bg-[rgba(245,245,245,0.9)] border border-[rgba(0,0,0,0.2)] text-gray-900',
			lightweight: 'bg-gray-100 border border-[rgba(0,0,0,0.2)] text-gray-900'
		},
		dark: {
			base: 'bg-[var(--dark-back)] border border-[rgba(255,255,255,0.2)] text-gray-100',
			children: 'bg-[rgba(64,64,64,0.9)] border border-[rgba(255,255,255,0.3)] text-gray-100',
			lightweight: 'bg-gray-700 border border-[rgba(255,255,255,0.2)] text-gray-100'
		},
		neon: {
			base: 'bg-[var(--dark-back)] border border-[rgba(255,255,255,0.2)] text-gray-100',
			children: 'bg-[var(--dark-back)] border border-[rgb(119,255,153)]/70 text-gray-100',
			lightweight: 'bg-gray-700 border border-[rgba(255,255,255,0.2)] text-gray-100'
		}
	};

	const currentTheme = themeStyles[theme as keyof typeof themeStyles];
	const styleVariant = lightweight ? 'lightweight' : (isChildren ? 'children' : 'base');
	
	return (
		<div
			className={clsx(
				currentTheme[styleVariant as keyof typeof currentTheme],
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