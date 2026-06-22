'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { useUserById } from '@/hooks/api/useUsers';
import { getUserHighestRole } from '@/util/userRole';
import { UserRoleStatus } from '@/types/model/userRole';

const publicPaths = ['/maintenance', '/login', '/register', '/auth/find', '/auth/callback', '/auth/reset-password'];

const ClientAuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const { loading, isLoggedIn, session } = useSession();
	const { showToast } = useToast();
	const searchParams = useSearchParams();
	const isLoggedOut = searchParams.get('loggedOut') === '1';
	const isLoggingOut = typeof window !== 'undefined' && localStorage.getItem('isLoggingOut') === '1';

	const [ready, setReady] = useState(false);

	// 관리자 페이지 경로 확인
	const isAdminPath = pathname?.startsWith('/admin');
	// 사용자 정보 조회 (권한 확인용)
	const { data: user, isLoading: userLoading } = useUserById(session?.user?.id || '');

	// 관리자 페이지 접근 시 권한 체크
	useEffect(() => {
		if (isAdminPath && isLoggedIn && !userLoading && user) {
			const userRole = getUserHighestRole(user);
			if (userRole === UserRoleStatus.User) {
				showToast({
					message: '관리자 권한이 필요합니다.',
					iconType: 'error',
					autoCloseTime: 3000,
				});
				// toast 알림 용 시간 지연
				setTimeout(() => {
					router.replace('/');
				}, 100);
			}
		}
	}, [isAdminPath, isLoggedIn, userLoading, user, showToast, router]);

	// 로그인 상태 및 공용 경로 처리
	useEffect(() => {
		if (!loading) {
			// 로그아웃 중이거나 로그아웃된 상태라면 즉시 ready로 설정
			if (isLoggingOut || isLoggedOut) {
				setReady(true);
				return;
			}

			// 로그인하지 않은 상태에서 보호된 페이지 접근 시
			if (!isLoggedIn && !publicPaths.includes(pathname)) {
				showToast({
					message: '접근 정보가 없거나 만료되었습니다. 이용을 원하시면 로그인해주세요.',
					iconType: 'error',
					autoCloseTime: 3000,
				});
				// toast 알림 용 시간 지연
				setTimeout(() => {
					router.replace('/login');
				}, 100);
			} else {
				setReady(true);
			}
		}
	}, [loading, isLoggedIn, pathname, router, showToast, isLoggedOut, isLoggingOut]);

	// 로그아웃 중이거나 공용 경로라면 즉시 렌더링
	if (isLoggingOut || isLoggedOut) return <>{children}</>;

	// 관리자 페이지 접근 시 권한 체크 완료 전까지 렌더링 차단
	if (isAdminPath) {
		if (!isLoggedIn || userLoading || !user || getUserHighestRole(user) === UserRoleStatus.User) return null;
	}

	// 보호된 페이지 접근 시 준비가 완료되지 않았다면 렌더링 차단
	if (!ready && !publicPaths.includes(pathname)) return null;

	return <>{children}</>;
};

export default ClientAuthWrapper;