'use client'

import { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import Button from '@/components/base/Button';
import { motion } from 'framer-motion';
import FriendList from '@/app/my/components/tabs/friend/FriendList';
import FriendRequests from '@/app/my/components/tabs/friend/FriendRequests';
import AddFriend from '@/app/my/components/tabs/friend/AddFriend';
import { SmileIcon } from '@/components/icon/SmileIcon';
import { WritingIcon } from '@/components/icon/WritingIcon';
import { ThumbUpIcon } from '@/components/icon/ThumbUpIcon';

type FriendsTabType = 'friends' | 'requests' | 'add';

const FriendsTab = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const [activeTab, setActiveTab] = useState<FriendsTabType>('friends');

  const tabs = [
    { 
      id: 'friends' as FriendsTabType, 
      label: '친구 목록', 
      icon: SmileIcon,
      count: 0 // TODO: 친구 수 표시
    },
    { 
      id: 'requests' as FriendsTabType, 
      label: '친구 요청', 
      icon: ThumbUpIcon,
      count: 0 // TODO: 요청 수 표시
    },
    { 
      id: 'add' as FriendsTabType, 
      label: '친구 추가', 
      icon: WritingIcon,
      count: 0
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
    <div>
      {/* 탭 네비게이션 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4"
      >
        <div className="flex flex-wrap gap-1 md:gap-2 w-full justify-between md:justify-start">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                theme={theme}
                padding={'py-1.5 px-3 md:py-2 md:px-4'}
                className={`gap-1.5 md:gap-2 font-semibold relative text-sm md:text-base`}
                style={{ minWidth: 'auto' }}
                reverse={theme === 'normal'}
                light={activeTab !== tab.id}
                on={isActive}
              >
                <Icon />
                <span className="truncate">{tab.label}</span>
                {tab.count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
                    {tab.count}
                  </span>
                )}
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

export default FriendsTab; 