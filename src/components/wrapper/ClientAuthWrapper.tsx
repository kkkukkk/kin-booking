'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { useSpinner } from '@/providers/SpinnerProvider'; // 경로는 맞게 수정

const publicPaths = ['/login', '/register', '/auth/find'];

const ClientAuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const { loading, isLoggedIn } = useSession();
	const { showToast } = useToast();
	const { showSpinner, hideSpinner } = useSpinner();

	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!loading) {
			if (!isLoggedIn && !publicPaths.includes(pathname)) {
				showSpinner(true);
				showToast({
					message: '비 정상적인 접근이에요. 로그인 화면으로 이동합니다.',
					iconType: 'error',
					autoCloseTime: 3000,
				});
				router.push('/login');
			} else {
				setReady(true);
			}
		}
	}, [loading, isLoggedIn, pathname, router, showSpinner, showToast]);

	useEffect(() => {
		if (ready) {
			hideSpinner();
		}
	}, [ready, hideSpinner]);

	if (!ready && !publicPaths.includes(pathname)) {
		return null;
	}

	return <>{children}</>;
};

export default ClientAuthWrapper;