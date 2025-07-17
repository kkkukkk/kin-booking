'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface Props {
	children: React.ReactNode;
}

const PathnameWrapper = ({ children }: Props) => {
	const pathname = usePathname();
	const isFullWidthPage = pathname === '/terms' || pathname === '/about' || pathname === '/';

	return (
		<div className={`${isFullWidthPage ? '' : 'layout-grid'} bg-image`}>
			{children}
		</div>
	);
};

export default PathnameWrapper;