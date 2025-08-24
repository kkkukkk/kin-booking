'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useBackgroundImage } from '@/hooks/useBackgroundImage';

interface Props {
	children: React.ReactNode;
}

const PathnameWrapper = ({ children }: Props) => {
	const pathname = usePathname();
	const isFullWidthPage = pathname === '/terms' || pathname === '/about' || pathname === '/';
	const isAdminPath = pathname.startsWith('/admin');

	// 배경 이미지 훅 사용 (모든 페이지에서 실행)
	useBackgroundImage();

	return (
		<div className={`${isFullWidthPage || isAdminPath ? '' : 'layout-grid'} ${isAdminPath ? '' : 'bg-image'}`}>
			{children}
		</div>
	);
};

export default PathnameWrapper;