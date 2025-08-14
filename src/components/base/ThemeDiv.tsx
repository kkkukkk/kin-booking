'use client';

import React from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import clsx from 'clsx';
import useRehydrated from '@/hooks/useIsRehydrated';
import { NeonVariant, DEFAULT_NEON_VARIANT } from '@/types/ui/neonVariant';

type ThemeDivProps = React.HTMLAttributes<HTMLDivElement> & {
	children?: React.ReactNode;
	isChildren?: boolean;
	lightweight?: boolean;
	neonVariant?: NeonVariant;
};

// theme 따라가는 div
const ThemeDiv = ({ children, className, isChildren, lightweight = false, neonVariant = DEFAULT_NEON_VARIANT, ...rest }: ThemeDivProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const rehydrated = useRehydrated();

	if (!rehydrated) return null;

	// 네온 색상 변형 (CSS 변수 사용)
	const getNeonStyles = (variant: NeonVariant) => {
		const colors = {
			green: { 
				border: 'border-[var(--neon-green)]/50',
			},
			cyan: { 
				border: 'border-[var(--neon-cyan)]/50',
			},
			magenta: { 
				border: 'border-[var(--neon-magenta)]/50',
			},
			pink: { 
				border: 'border-[var(--neon-pink)]/50', 
			},
			blue: { 
				border: 'border-[var(--neon-blue)]/50',
			},
			yellow: { 
				border: 'border-[var(--neon-yellow)]/50',
			},
			purple: { 
				border: 'border-[var(--neon-purple)]/50',
			}
		};
		return colors[variant as keyof typeof colors] || colors.green;
	};

	// 테마별 스타일
	const themeStyles = {
		normal: {
			base: 'bg-[var(--normal-back)] border border-[rgba(0,0,0,0.2)] text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.1)]',
			children: 'bg-[rgba(245,245,245,0.9)] border border-[rgba(0,0,0,0.1)] text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_1px_3px_rgba(0,0,0,0.08)]',
			lightweight: 'bg-gray-100 border border-[rgba(0,0,0,0.1)] text-gray-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_1px_2px_rgba(0,0,0,0.05)]'
		},
		dark: {
			base: 'bg-[var(--dark-back)] border border-[rgba(255,255,255,0.2)] text-gray-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_2px_4px_rgba(0,0,0,0.3)]',
			children: 'bg-[rgba(30,30,30,0.95)] border border-[rgba(255,255,255,0.25)] text-gray-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.15),0_1px_3px_rgba(0,0,0,0.4)]',
			lightweight: 'bg-gray-700 border border-[rgba(255,255,255,0.2)] text-gray-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.2)]'
		},
		neon: {
			base: 'bg-[var(--dark-back)] border border-[rgba(255,255,255,0.2)] text-gray-100 shadow-[inset_0_1px_0_var(--neon-green-light),0_2px_4px_rgba(0,0,0,0.3)]',
			children: `bg-[var(--dark-back)] border ${getNeonStyles(neonVariant).border} text-gray-100`,
			lightweight: 'bg-gray-700 border border-[rgba(255,255,255,0.2)] text-gray-100 shadow-[inset_0_1px_0_var(--neon-green-faint),0_1px_2px_rgba(0,0,0,0.2)]'
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