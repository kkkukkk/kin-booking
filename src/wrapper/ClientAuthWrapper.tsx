'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';

const publicPaths = ['/login', '/register', '/auth/find', '/auth/callback', '/auth/reset-password'];

const ClientAuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const { loading, isLoggedIn } = useSession();
	const { showToast } = useToast();
	const searchParams = useSearchParams();
	const isLoggedOut = searchParams.get('loggedOut') === '1';

	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!loading) {
			if (!isLoggedIn && !publicPaths.includes(pathname)) {
				if (!isLoggedOut) {
					showToast({
						message: '비정상 접근이에요. 로그인 화면으로 이동합니다.',
						iconType: 'error',
						autoCloseTime: 3000,
					});
					router.push('/login');
				} else {
					// 로그아웃시 ready 상태로 설정
					setReady(true);
				}
			} else {
				setReady(true);
			}
		}
	}, [loading, isLoggedIn, pathname, router, showToast, isLoggedOut]);

	if (!ready && !publicPaths.includes(pathname)) {
		return null;
	}

	return <>{children}</>;
};

export default ClientAuthWrapper;