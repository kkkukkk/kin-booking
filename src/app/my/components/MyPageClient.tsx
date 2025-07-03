'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import { useSpinner } from '@/hooks/useSpinner';
import { supabase } from '@/lib/supabaseClient';
import { useUserById } from '@/hooks/api/useUsers';
import { useReservationsByUserId } from '@/hooks/api/useReservations';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import SpinnerOverlay from '@/components/spinner/SpinnerOverlay';
import { HomeIcon } from '@/components/icon/HomeIcon';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { SmileIcon } from '@/components/icon/SmileIcon';
import { CalendarIcon } from '@/components/icon/CalendarIcon';
import { LogoutIcon } from '@/components/icon/LogoutIcon';
import { getUserHighestRole, getRoleDisplayName, getRoleBadgeColor } from '@/util/userRole';
import ProfileTab from '@/app/my/components/tabs/ProfileTab';
import ReservationsTab from '@/app/my/components/tabs/ReservationsTab';
import TicketsTab from '@/app/my/components/tabs/TicketsTab';

type MyPageTab = 'profile' | 'reservations' | 'tickets';

const MyPageClient = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { session } = useSession();
	const { showToast } = useToast();
	const { showAlert } = useAlert();
	const { showSpinner, hideSpinner } = useSpinner();
	const router = useRouter();
	
	const [activeTab, setActiveTab] = useState<MyPageTab>('profile');
	
	// 사용자 정보 조회 (API에서 가져오기 실패 시 Supabase Auth 정보 사용)
	const { data: user, isLoading: userLoading, error: userError } = useUserById(session?.user?.id || '');
	
	// API에서 사용자 정보를 가져올 수 없는 경우 Supabase Auth 정보를 사용
	const fallbackUser = userError ? {
		id: session?.user?.id || '',
		name: session?.user?.user_metadata?.display_name || '사용자',
		email: session?.user?.email || '',
		phoneNumber: session?.user?.user_metadata?.phone_number || null,
		registerDate: session?.user?.created_at || new Date().toISOString(),
		marketingConsent: session?.user?.user_metadata?.marketing_consent || false,
		status: 'active'
	} : null;
	
	// 예매 내역 조회
	const { data: reservations, isLoading: reservationsLoading } = useReservationsByUserId(session?.user?.id || '');
	
	const displayUser = user || fallbackUser;
	
	// 사용자 권한 정보 (user가 UserWithRoles 타입이므로 타입 단언 사용)
	const userRole = getUserHighestRole(displayUser as any || null);
	const roleDisplayName = getRoleDisplayName(userRole);
	const roleBadgeColor = getRoleBadgeColor(userRole);
	
	const isLoading = userLoading || reservationsLoading;
	
	// 로그아웃 처리
	const handleLogout = async () => {
		const confirmed = await showAlert({
			type: 'confirm',
			title: '로그아웃',
			message: '정말 로그아웃하시겠습니까?',
		});
		
		if (confirmed) {
			showSpinner();
			try {
				await supabase.auth.signOut();
				showToast({ message: '로그아웃되었습니다.', iconType: 'success' });
				router.push('/');
			} catch (error) {
				showToast({ message: '로그아웃 중 오류가 발생했습니다.', iconType: 'error' });
			} finally {
				hideSpinner();
			}
		}
	};
	
	const tabs = [
		{ id: 'profile' as MyPageTab, label: '프로필', icon: SmileIcon },
		{ id: 'reservations' as MyPageTab, label: '예매 내역', icon: CalendarIcon },
		{ id: 'tickets' as MyPageTab, label: '티켓 관리', icon: TicketIcon },
	];
	
	const renderTabContent = () => {
		switch (activeTab) {
			case 'profile':
				return <ProfileTab user={displayUser} />;
			case 'reservations':
				return <ReservationsTab reservations={reservations} />;
			case 'tickets':
				return <TicketsTab userId={session?.user?.id || ''} />;
			default:
				return null;
		}
	};
	
	return (
		<div className="p-4 md:p-6">
			{isLoading && <SpinnerOverlay />}
			
			{/* 헤더 */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="mb-6"
			>
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-2xl md:text-3xl font-bold">마이페이지</h1>
					<div className="flex gap-2">
						<Button
							onClick={() => router.push('/')}
							theme="dark"
							className="px-2 py-1 text-sm"
						>
							<HomeIcon className="w-4 h-4 mr-1" />
							홈
						</Button>
						<Button
							onClick={handleLogout}
							theme="dark"
							className="px-2 py-1 text-sm"
						>
							<LogoutIcon className="w-4 h-4 mr-1" />
							로그아웃
						</Button>
					</div>
				</div>
			</motion.div>

			{/* 상단 프로필 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="mb-4"
			>
				<ThemeDiv className="p-6 rounded-lg" isChildren>
					<div className="flex items-center gap-6">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-xl font-bold">
									{displayUser?.name || '사용자'}
								</h2>
								<span className={`px-3 py-1 rounded-full text-xs font-semibold ${roleBadgeColor}`}>
									{roleDisplayName}
								</span>
							</div>
							<p className="text-gray-600 mb-1">
								{displayUser?.email || '이메일 정보 없음'}
							</p>
							<p className="text-sm text-gray-500">
								가입일: {displayUser?.registerDate ? new Date(displayUser.registerDate).toLocaleDateString('ko-KR') : '알 수 없음'}
							</p>
						</div>
					</div>
				</ThemeDiv>
			</motion.div>

			{/* 탭 네비게이션 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="mb-4"
			>
				<div className="flex gap-2 w-full justify-between md:justify-end">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<Button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								theme={theme}
								padding={'py-1'}
								className={`gap-2 font-semibold`}
								style={{ minWidth: 100 }}
								reverse={theme === 'normal'}
								light={theme !== 'normal'}
								on={isActive}
							>
								<Icon />
								<span>{tab.label}</span>
							</Button>
						);
					})}
				</div>
			</motion.div>
			
			{/* 탭 콘텐츠 */}
			<motion.div
				key={activeTab}
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3 }}
			>
				{renderTabContent()}
			</motion.div>
		</div>
	);
};

export default MyPageClient; 