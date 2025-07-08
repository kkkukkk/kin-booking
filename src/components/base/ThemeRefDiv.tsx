'use client'

import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import useRehydrated from '@/hooks/useIsRehydrated';

type ThemeRefDivProps = React.HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode;
	isChildren?: boolean;
	lightweight?: boolean;
};

const ThemeRefDiv = forwardRef<HTMLDivElement, ThemeRefDivProps>(
	({ children, className, isChildren, lightweight = false, ...rest }, ref) => {
		const theme = useAppSelector((state: RootState) => state.theme.current);
		const rehydrated = useRehydrated();

		if (!rehydrated) return null;

		// 테마별 스타일
		const themeStyles = {
			normal: {
				base: 'bg-[var(--normal-back)] border border-[rgba(0,0,0,0.2)] text-gray-900',
				children: 'bg-[rgba(245,245,245,0.9)] border border-[rgba(0,0,0,0.2)] text-gray-900',
				lightweight: 'bg-gray-100 border border-[rgba(0,0,0,0.2)] text-gray-900'
			},
			dark: {
				base: 'bg-[var(--dark-back)] border border-[rgba(255,255,255,0.3)] text-gray-100',
				children: 'bg-[rgba(64,64,64,0.9)] border border-[rgba(255,255,255,0.3)] text-gray-100',
				lightweight: 'bg-gray-700 border border-[rgba(255,255,255,0.3)] text-gray-100'
			},
			neon: {
				base: 'bg-[var(--dark-back)] border border-[rgba(255,255,255,0.3)] text-gray-100',
				children: 'bg-[rgba(64,64,64,0.9)] border border-[rgba(255,255,255,0.3)] text-gray-100',
				lightweight: 'bg-gray-700 border border-[rgba(255,255,255,0.3)] text-gray-100'
			}
		};

		const currentTheme = themeStyles[theme as keyof typeof themeStyles];
		const styleVariant = lightweight ? 'lightweight' : (isChildren ? 'children' : 'base');
		
		return (
			<div
				ref={ref}
				className={clsx(
					currentTheme[styleVariant as keyof typeof currentTheme],
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