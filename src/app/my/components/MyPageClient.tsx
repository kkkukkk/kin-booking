'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import { useUserById } from '@/hooks/api/useUsers';
import { useLogout } from '@/hooks/api/useAuth';
import { useReservationsByUserId } from '@/hooks/api/useReservations';
import { useTeamMemberById } from '@/hooks/api/useTeamMembers';
import Button from '@/components/base/Button';
import ThemeDiv from '@/components/base/ThemeDiv';
import SpinnerOverlay from '@/components/spinner/SpinnerOverlay';
import { HomeIcon } from '@/components/icon/HomeIcon';
import { TicketIcon } from '@/components/icon/TicketIcon';
import { SmileIcon } from '@/components/icon/SmileIcon';
import { UsersIcon } from '@/components/icon/FriendIcons';
import { CalendarIcon } from '@/components/icon/CalendarIcon';
import { LogoutIcon } from '@/components/icon/LogoutIcon';
import { ThumbUpIcon } from '@/components/icon/ThumbUpIcon';
import { getUserHighestRole } from '@/util/userRole';
import { StatusBadge } from '@/components/status/StatusBadge';
import ProfileTab from '@/app/my/components/tabs/ProfileTab';
import ReservationsTab from '@/app/my/components/tabs/ReservationsTab';
import TicketsTab from '@/app/my/components/tabs/TicketsTab';
import FriendsTab from '@/app/my/components/tabs/FriendsTab';
import TeamTab from '@/app/my/components/tabs/TeamTab';
import clsx from 'clsx';

// 탭 타입에 team 추가
type MyPageTab = 'profile' | 'reservations' | 'tickets' | 'friends' | 'team';

const MyPageClient = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { session } = useSession();
	const { showToast } = useToast();
	const { showAlert } = useAlert();
	const router = useRouter();
	const { mutate: logout } = useLogout();

	const [activeTab, setActiveTab] = useState<MyPageTab>('profile');
	
	// 사용자 정보 조회
	const { data: user, isLoading: userLoading } = useUserById(session?.user?.id || '');
	// 멤버 정보 조회 - 먼저 사용자 ID로 팀 멤버 정보를 찾아야 함
	const { data: teamMember, isLoading: teamMemberLoading } = useTeamMemberById(session?.user?.id || '');
	// 예매 내역 조회
	const { data: reservations, isLoading: reservationsLoading } = useReservationsByUserId(session?.user?.id || '');
	

	
	// 사용자 권한 정보
	const userRole = getUserHighestRole(user || null);
	
	const isLoading = userLoading || reservationsLoading || teamMemberLoading;
	
	// 로그아웃 처리
	const handleLogout = async () => {
		const confirmed = await showAlert({
			type: 'confirm',
			title: '로그아웃',
			message: '정말 로그아웃하시겠습니까?',
		});
		
		if (confirmed) {
			logout(undefined, {
				onSuccess: () => {
					showToast({ message: '로그아웃되었습니다.', iconType: 'success', autoCloseTime: 3000 });
					router.push('/login?loggedOut=1');
				},
				onError: () => {
					showToast({ message: '로그아웃 중 오류가 발생했습니다.', iconType: 'error', autoCloseTime: 3000 });
				}
			});
		}
	};

	const tabs = [
		{ id: 'profile' as MyPageTab, label: '프로필', icon: SmileIcon },
		{ id: 'reservations' as MyPageTab, label: '예매 내역', icon: CalendarIcon },
		{ id: 'tickets' as MyPageTab, label: '티켓 관리', icon: TicketIcon },
		{ id: 'friends' as MyPageTab, label: '친구 관리', icon: ThumbUpIcon },
		...(teamMember ? [{ id: 'team' as MyPageTab, label: '멤버 정보', icon: UsersIcon }] : []),
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case 'profile':
				return user ? <ProfileTab user={user} /> : null;
			case 'reservations':
				return <ReservationsTab reservations={reservations} />;
			case 'tickets':
				return <TicketsTab userId={session?.user?.id || ''} />;
			case 'friends':
				return <FriendsTab />;
			case 'team':
				return teamMember ? <TeamTab teamMember={teamMember} /> : null;
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
									{user?.name || '사용자'}
								</h2>
								<StatusBadge 
									status={userRole}
									theme={theme} 
									variant="badge" 
									size="sm" 
								/>
							</div>
							<p className={clsx(
								"mb-1",
								theme === 'normal' ? 'text-gray-600' : 'text-gray-300'
							)}>
								{user?.email || '이메일 정보 없음'}
							</p>
							<p className={clsx(
								"text-sm",
								theme === 'normal' ? 'text-gray-500' : 'text-gray-400'
							)}>
								가입일: {user?.registerDate ? new Date(user.registerDate).toLocaleDateString('ko-KR') : '알 수 없음'}
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
				{/* 모바일: 2x2 그리드, 데스크톱: 가로 배치 */}
				<div className="grid grid-cols-2 gap-1 md:flex md:flex-wrap md:gap-2 w-full md:justify-end">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<Button
								key={tab.id}
								onClick={() => setActiveTab(tab.id as MyPageTab)}
								theme={theme}
								padding={'py-2.5 md:py-1.5'}
								className={`gap-3 md:gap-3.5 font-semibold text-sm md:text-base transition-all duration-200`}
								style={{ minWidth: 'auto', width: '100%' }}
								reverse={theme === 'normal'}
								light={activeTab !== tab.id}
								on={isActive}
							>
								<Icon />
								<span className="truncate">{tab.label}</span>
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