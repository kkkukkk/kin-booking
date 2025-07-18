'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from '@/hooks/useSession';
import { useUserById } from '@/hooks/api/useUsers';
import { getUserHighestRole } from '@/util/userRole';
import { UserRoleStatus } from '@/types/model/userRole';
import useToast from '@/hooks/useToast';
import SpinnerOverlay from '@/components/spinner/SpinnerOverlay';

const AdminAuthWrapper = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();
	const router = useRouter();
	const { loading, isLoggedIn, session } = useSession();
	const { showToast } = useToast();
	
	// session이 있을 때만 사용자 정보를 가져옴
	const { data: user, isLoading: userLoading } = useUserById(session?.user?.id || '');

	const [ready, setReady] = useState(false);

	// 관리자 권한 체크 함수
	const hasAdminAccess = (userRole: UserRoleStatus) => {
		return [
			UserRoleStatus.Member,
			UserRoleStatus.Manager,
			UserRoleStatus.Master
		].includes(userRole);
	};

	useEffect(() => {
		if (!loading && !userLoading) {
			if (!isLoggedIn) {
				showToast({
					message: '관리자 페이지 접근을 위해 로그인이 필요합니다.',
					iconType: 'error',
					autoCloseTime: 3000,
				});
				router.push('/login');
				return;
			}

			if (user) {
				const userRole = getUserHighestRole(user);
				if (!hasAdminAccess(userRole)) {
					showToast({
						message: '관리자 권한이 없습니다.',
						iconType: 'error',
						autoCloseTime: 3000,
					});
					router.push('/');
					return;
				}
			}

			setReady(true);
		}
	}, [loading, userLoading, isLoggedIn, user, router, showToast]);

	// 로딩 중이거나 권한이 없는 경우
	if (loading || userLoading || !ready) {
		return <SpinnerOverlay />;
	}

	return <>{children}</>;
};

export default AdminAuthWrapper; 