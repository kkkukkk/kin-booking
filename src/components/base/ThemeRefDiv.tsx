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
			base: 'bg-[var(--normal-back)] border border-[rgba(0,0,0,0.2)] text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)]',
			children: 'bg-[rgba(245,245,245,0.9)] border border-[rgba(0,0,0,0.2)] text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_3px_rgba(0,0,0,0.08)]',
			lightweight: 'bg-gray-100 border border-[rgba(0,0,0,0.2)] text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.05)]'
		},
		dark: {
			base: 'bg-[var(--dark-back)] border border-[rgba(255,255,255,0.2)] text-gray-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]',
			children: 'bg-[rgba(30,30,30,0.95)] border border-[rgba(255,255,255,0.25)] text-gray-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_3px_rgba(0,0,0,0.4)]',
			lightweight: 'bg-gray-700 border border-[rgba(255,255,255,0.2)] text-gray-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.2)]'
		},
		neon: {
			base: 'bg-[var(--dark-back)] border border-[rgba(255,255,255,0.3)] text-gray-100 shadow-[inset_0_1px_0_rgba(119,255,153,0.2),0_2px_4px_rgba(0,0,0,0.3)]',
			children: 'bg-[rgba(64,64,64,0.9)] border border-[rgba(255,255,255,0.3)] text-gray-100 shadow-[inset_0_1px_0_rgba(119,255,153,0.3),0_1px_3px_rgba(0,0,0,0.4)]',
			lightweight: 'bg-gray-700 border border-[rgba(255,255,255,0.3)] text-gray-100 shadow-[inset_0_1px_0_rgba(119,255,153,0.15),0_1px_2px_rgba(0,0,0,0.2)]'
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