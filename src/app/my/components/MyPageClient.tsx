'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useSession } from '@/hooks/useSession';
import useToast from '@/hooks/useToast';
import { useAlert } from '@/providers/AlertProvider';
import { useUserById } from '@/hooks/api/useUsers';
import { useLogout } from '@/hooks/api/useAuth';
import { useTeamMemberById } from '@/hooks/api/useTeamMembers';
import Button from '@/components/base/Button';
import ThemeDiv from '@/components/base/ThemeDiv';
import SpinnerOverlay from '@/components/spinner/SpinnerOverlay';
import { HomeIcon } from '@/components/icon/HomeIcon';
import { SingleTicketIcon, ProfileIcon, UsersIcon, TeamIcon } from '@/components/icon/FriendIcons';
import { CalendarIcon } from '@/components/icon/CalendarIcon';
import { LogoutIcon } from '@/components/icon/LogoutIcon';
import { getUserHighestRole } from '@/util/userRole';
import { UserRoleStatus } from '@/types/model/userRole';
import { StatusBadge } from '@/components/status/StatusBadge';
import ProfileTab from '@/app/my/components/tabs/ProfileTab';
import ReservationsTab from '@/app/my/components/tabs/ReservationsTab';
import TicketsTab from '@/app/my/components/tabs/TicketsTab';
import FriendsTab from '@/app/my/components/tabs/FriendsTab';
import TeamTab from '@/app/my/components/tabs/TeamTab';
import clsx from 'clsx';
import dayjs from 'dayjs';

// 탭 타입
type MyPageTab = 'profile' | 'reservations' | 'tickets' | 'friends' | 'team';

const MyPageClient = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const { session } = useSession();
	const { showToast } = useToast();
	const { showAlert } = useAlert();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { mutate: logout } = useLogout();

	const [activeTab, setActiveTab] = useState<MyPageTab>('profile');

	// URL 파라미터에서 탭 설정
	useEffect(() => {
		const tabParam = searchParams.get('tab') as MyPageTab;
		if (tabParam && ['profile', 'reservations', 'tickets', 'friends', 'team'].includes(tabParam)) {
			setActiveTab(tabParam);
		}
	}, [searchParams]);
	
	// 사용자 정보 조회
	const { data: user, isLoading: userLoading } = useUserById(session?.user?.id || '');
	// 멤버 정보 조회
	const { data: teamMember, isLoading: teamMemberLoading } = useTeamMemberById(session?.user?.id || '');
	
	// 사용자 권한 정보
	const userRole = getUserHighestRole(user || null);
	
	const isLoading = userLoading || teamMemberLoading;
	
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
		{ id: 'profile' as MyPageTab, label: '프로필', icon: ProfileIcon },
		{ id: 'reservations' as MyPageTab, label: '예매 내역', icon: CalendarIcon },
		{ id: 'tickets' as MyPageTab, label: '티켓 관리', icon: SingleTicketIcon },
		{ id: 'friends' as MyPageTab, label: '친구 관리', icon: UsersIcon },
		...(teamMember ? [{ id: 'team' as MyPageTab, label: '멤버 정보', icon: TeamIcon }] : []),
	];

	const renderTabContent = () => {
		switch (activeTab) {
			case 'profile':
				return user ? <ProfileTab user={user} /> : null;
			case 'reservations':
				return <ReservationsTab />;
			case 'tickets':
				return <TicketsTab />;
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
						{userRole !== UserRoleStatus.User && (
							<Button
								onClick={() => router.push('/admin')}
								theme="dark"
								padding="px-2 py-1"
								fontSize='text-sm'
								className="font-semibold bg-purple-600 hover:bg-purple-700"
							>
								관리자
							</Button>
						)}
						<Button
							onClick={() => router.push('/')}
							theme="dark"
							padding="px-2 py-1"
							fontSize='text-sm'
							className="font-semibold"
						>
							<HomeIcon className="w-4 h-4 mr-1" />
							홈
						</Button>
						<Button
							onClick={handleLogout}
							theme="dark"
							padding="px-2 py-1"
							fontSize='text-sm'
							className="font-semibold"
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
				<ThemeDiv className="p-6 rounded" isChildren>
					<div className="flex items-center gap-6">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-lg sm:text-xl font-bold">
									{user?.name || '사용자'}
								</h2>
								<StatusBadge 
									status={userRole}
									theme={theme} 
									variant="badge" 
									size="sm" 
									statusType="userRole"
								/>
							</div>
							<p className={clsx(
								"mb-1 text-sm md:text-base",
								theme === 'normal' ? 'text-gray-600' : 'text-gray-300'
							)}>
								{user?.email || '이메일 정보 없음'}
							</p>
							<p className={clsx(
								"text-xs md:text-sm",
								theme === 'normal' ? 'text-gray-500' : 'text-gray-400'
							)}>
								{user?.registerDate ? dayjs(user.registerDate).format('YYYY년 MM월 DD일') : '알 수 없음'} 가입
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
				<div className="grid grid-cols-2 gap-1 md:flex md:gap-2 w-full md:justify-end">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<Button
								key={tab.id}
								onClick={() => {
									setActiveTab(tab.id as MyPageTab);
									// URL 업데이트 (탭 변경 시)
									const newUrl = new URL(window.location.href);
									newUrl.searchParams.set('tab', tab.id);
									
									// 다른 탭의 파라미터들 정리
									newUrl.searchParams.delete('filter');  // reservations 탭
									newUrl.searchParams.delete('section'); // friends 탭
									
									router.replace(newUrl.pathname + newUrl.search);
								}}
								theme={theme}
								padding={'py-2 md:py-1.5'}
								fontSize='text-sm md:text-base'
								className={`gap-3 md:gap-3.5 font-semibold`}
								style={{ minWidth: 'auto', width: '100%' }}
								reverse={theme === 'normal'}
								light={true}
								on={isActive}
							>
								<Icon className="w-4.5 h-4.5" />
								<span className={"truncate"}>{tab.label}</span>
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