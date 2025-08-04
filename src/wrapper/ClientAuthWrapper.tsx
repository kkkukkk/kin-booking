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
	const isLoggingOut = typeof window !== 'undefined' && localStorage.getItem('isLoggingOut') === '1';

	const [ready, setReady] = useState(false);

	useEffect(() => {
		if (!loading) {
			if (!isLoggedIn && !publicPaths.includes(pathname)) {
				if (!isLoggedOut && !isLoggingOut) {
					showToast({
						message: '접근 정보가 없거나 만료되었습니다. 이용을 원하시면 로그인해주세요.',
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
	}, [loading, isLoggedIn, pathname, router, showToast, isLoggedOut, isLoggingOut]);

	if (!ready && !publicPaths.includes(pathname)) {
		return null;
	}

	return <>{children}</>;
};

export default ClientAuthWrapper;