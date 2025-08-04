'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface Props {
	children: React.ReactNode;
}

const PathnameWrapper = ({ children }: Props) => {
	const pathname = usePathname();
	const isFullWidthPage = pathname === '/terms' || pathname === '/about' || pathname === '/';
	const isAdminPath = pathname.startsWith('/admin');

	return (
		<div className={`${isFullWidthPage || isAdminPath ? '' : 'layout-grid'} ${isAdminPath ? '' : 'bg-image'}`}>
			{children}
		</div>
	);
};

export default PathnameWrapper;