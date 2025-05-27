'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

interface Props {
	children: React.ReactNode;
}

const PathnameWrapper = ({ children }: Props) => {
	const pathname = usePathname();
	const isEnterPage = pathname === '/enter';

	return (
		<div className={`layout-grid ${isEnterPage ? 'enter' : ''} bg-image`}>
			{children}
		</div>
	);
};

export default PathnameWrapper;