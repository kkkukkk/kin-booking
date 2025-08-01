'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Button from '@/components/base/Button';
import ThemeDiv from '@/components/base/ThemeDiv';
import { motion } from 'framer-motion';
import FriendList from '@/app/my/components/tabs/friend/FriendList';
import FriendRequests from '@/app/my/components/tabs/friend/FriendRequests';
import AddFriend from '@/app/my/components/tabs/friend/AddFriend';
import { UsersIcon, RequestIcon, SearchIcon } from '@/components/icon/FriendIcons';

type FriendsTabType = 'friends' | 'requests' | 'add';

const FriendsTab = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<FriendsTabType>('friends');

  // URL 파라미터에서 섹션 설정
  useEffect(() => {
    const sectionParam = searchParams.get('section') as FriendsTabType;
    if (sectionParam && ['friends', 'requests', 'add'].includes(sectionParam)) {
      setActiveTab(sectionParam);
    }
  }, [searchParams]);

  	const tabs = [
		{ 
	      id: 'friends' as FriendsTabType, 
	      label: '목록', 
	      icon: UsersIcon,
	      neonColor: 'cyan' as const
	    },
		{ 
	      id: 'requests' as FriendsTabType, 
	      label: '요청', 
	      icon: RequestIcon,
	      neonColor: 'cyan' as const
	    },
		{ 
	      id: 'add' as FriendsTabType, 
	      label: '추가', 
	      icon: SearchIcon,
	      neonColor: 'cyan' as const
	    },
	];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'friends':
        return <FriendList />;
      case 'requests':
        return <FriendRequests />;
      case 'add':
        return <AddFriend />;
      default:
        return null;
    }
  };

  	return (
		<>
			{/* 탭 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className="mb-4"
			>
				<div className="grid grid-cols-3 gap-1 md:gap-2 w-full justify-between md:justify-start">
					{tabs.map((tab) => {
						const Icon = tab.icon;
						const isActive = activeTab === tab.id;
						return (
							<Button
								key={tab.id}
								onClick={() => {
									setActiveTab(tab.id);
									// URL 업데이트 (섹션 변경 시)
									const newUrl = new URL(window.location.href);
									newUrl.searchParams.set('section', tab.id);
									router.replace(newUrl.pathname + newUrl.search);
								}}
								theme={theme}
								padding={'py-1.5 px-3 md:py-2 md:px-4'}
								className={`gap-1.5 md:gap-2 font-semibold relative text-sm md:text-base`}
								style={{ minWidth: 'auto' }}
								reverse={theme === 'normal'}
								light={true}
								on={isActive}
								neonVariant={tab.neonColor}
							>
								<div className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5">
									<Icon />
								</div>
								<span className="truncate"><span className="hidden sm:inline">친구 </span>{tab.label}</span>
							</Button>
						);
					})}
				</div>
			</motion.div>
			
			<ThemeDiv className="p-4 md:p-6 rounded" isChildren>
				<motion.div
					key={activeTab}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
				>
					{renderTabContent()}
				</motion.div>
			</ThemeDiv>
		</>
	);
};

export default FriendsTab; 