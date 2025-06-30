'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { useSpinner } from '@/providers/SpinnerProvider'; // 경로는 맞게 수정

const publicPaths = ['/login', '/register', '/auth/find', '/auth/callback', '/auth/reset-password'];

const ClientAuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const { loading, isLoggedIn } = useSession();
	const { showToast } = useToast();
	const { showSpinner, hideSpinner } = useSpinner();
	const searchParams = useSearchParams();
	const isLoggedOut = searchParams.get('loggedOut') === '1';

	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!loading) {
			if (!isLoggedIn && !publicPaths.includes(pathname)) {
				if (!isLoggedOut) {
					showSpinner(true);
					showToast({
						message: '비정상 접근이에요. 로그인 화면으로 이동합니다.',
						iconType: 'error',
						autoCloseTime: 3000,
					});
				}
				router.push('/login');
			} else {
				setReady(true);
			}
		}
	}, [loading, isLoggedIn, pathname, router, showSpinner, showToast, isLoggedOut]);

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