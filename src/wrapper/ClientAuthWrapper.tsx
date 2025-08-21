'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { useUserById } from '@/hooks/api/useUsers';
import { getUserHighestRole } from '@/util/userRole';
import { UserRoleStatus } from '@/types/model/userRole';

const publicPaths = ['/login', '/register', '/auth/find', '/auth/callback', '/auth/reset-password'];

const ClientAuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const { loading, isLoggedIn, session } = useSession();
	const { showToast } = useToast();
	const searchParams = useSearchParams();
	const isLoggedOut = searchParams.get('loggedOut') === '1';
	const isLoggingOut = typeof window !== 'undefined' && localStorage.getItem('isLoggingOut') === '1';

	const [ready, setReady] = useState(false);

	// 관리자 페이지 권한 체크
	const isAdminPath = pathname?.startsWith('/admin');
	const { data: user, isLoading: userLoading } = useUserById(session?.user?.id || '');

	// admin 경로 접근 시 권한 체크
	useEffect(() => {
		if (isAdminPath && isLoggedIn && !userLoading && user) {
			const userRole = getUserHighestRole(user);
			if (userRole === UserRoleStatus.User) {
				showToast({
					message: '관리자 권한이 필요합니다.',
					iconType: 'error',
					autoCloseTime: 3000,
				});
				// Toast가 보이도록 약간 지연 후 이동
				setTimeout(() => {
					router.replace('/');
				}, 100);
			}
		}
	}, [isAdminPath, isLoggedIn, userLoading, user, showToast, router]);

	useEffect(() => {
		if (!loading) {
			// 로그아웃 중이거나 로그아웃된 상태라면 즉시 ready로 설정
			if (isLoggingOut || isLoggedOut) {
				setReady(true);
				return;
			}

			if (!isLoggedIn && !publicPaths.includes(pathname)) {
				showToast({
					message: '접근 정보가 없거나 만료되었습니다. 이용을 원하시면 로그인해주세요.',
					iconType: 'error',
					autoCloseTime: 3000,
				});
				// Toast가 보이도록 약간 지연 후 이동
				setTimeout(() => {
					router.replace('/login');
				}, 100);
			} else {
				setReady(true);
			}
		}
	}, [loading, isLoggedIn, pathname, router, showToast, isLoggedOut, isLoggingOut]);

	// 로그아웃 중이거나 로그아웃된 상태라면 즉시 렌더링
	if (isLoggingOut || isLoggedOut) {
		return <>{children}</>;
	}

	// admin 페이지 접근 시 권한 체크 완료 전까지 렌더링 차단
	if (isAdminPath) {
		if (!isLoggedIn) {
			return null; // 로그인 페이지로 리다이렉트 중
		}

		if (userLoading || !user) {
			return null; // 사용자 정보 로딩 중이거나 없음
		}

		// 권한 체크
		const userRole = getUserHighestRole(user);
		if (userRole === UserRoleStatus.User) {
			return null; // 권한 부족으로 홈으로 리다이렉트 중
		}
	}

	if (!ready && !publicPaths.includes(pathname)) {
		return null;
	}

	return <>{children}</>;
};

export default ClientAuthWrapper;