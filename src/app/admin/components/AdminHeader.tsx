'use client';

import { useSession } from '@/hooks/useSession';
import { useUserById } from '@/hooks/api/useUsers';
import { useRouter } from 'next/navigation';
import { LogoutIcon } from '@/components/icon/LogoutIcon';
import { UsersIcon } from '@/components/icon/FriendIcons';
import UserAvatar from '@/components/user/UserAvatar';
import { supabase } from '@/lib/supabaseClient';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/hooks';
import Logo from '@/components/Logo';
import { useState } from 'react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import AdminSidebar from './AdminSidebar';

const AdminHeader = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { session } = useSession();
  const router = useRouter();
  const { data: user } = useUserById(session?.user?.id || '');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  return (
    <div className="relative">
      <ThemeDiv
        className="flex items-center justify-between px-4 py-4 border-0 border-b border-b-green-500/30 md:px-6 md:py-4"
        isChildren
      >
        {/* 왼쪽: 햄버거/토글 버튼 + 로고 */}
        <div className="flex items-center gap-3 md:gap-4 px-3 md:px-0">
          {/* 모바일: 햄버거 버튼 (드로어 토글) */}
          <Button
            variant="hamburger"
            on={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
            theme={theme}
            className="md:hidden"
            aria-label="메뉴 열기"
          />
          {/* PC: 사이드바 토글 버튼 */}
          <Button
            variant="hamburger"
            on={sidebarOpen}
            onClick={() => setSidebarOpen((v) => !v)}
            theme={theme}
            className="hidden md:inline-flex"
            aria-label="사이드바 토글"
          />
          <Logo width={60} className="md:w-[75px]" priority={true} />
          <div className="text-lg font-bold whitespace-nowrap md:text-2xl">
            관리자 패널
          </div>
        </div>
        {/* 오른쪽: 사용자 드롭다운 */}
        <div className="relative">
          {/* 사용자 아이콘 버튼 */}
          <Button
            onClick={toggleUserDropdown}
            theme={theme}
            padding="p-2"
            className="flex items-center justify-center"
            aria-label="사용자 메뉴"
          >
            <UsersIcon className="w-5 h-5" />
          </Button>
          {/* 드롭다운 메뉴 */}
          <AnimatePresence>
            {isUserDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 w-64 z-50"
              >
                <ThemeDiv
                  className={clsx(
                    'rounded shadow-lg',
                    theme === 'dark' ? 'border border-white/40' : ''
                  )}
                  isChildren={theme !== 'dark'}
                >
                  {/* 사용자 정보 */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-3">
                      <UserAvatar
                        name={user?.name || '관리자'}
                        size="sm"
                        className="border border-current"
                      />
                      <div>
                        <div className="text-sm font-medium">
                          {user?.name || '관리자'}
                        </div>
                        <div className="text-xs">
                          {user?.email || session?.user?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* 로그아웃 버튼 */}
                  <div className="p-2">
                    <Button
                      onClick={handleLogout}
                      theme={theme}
                      padding="px-3 py-2"
                      className="w-full flex items-center justify-center space-x-2"
                      aria-label="로그아웃"
                    >
                      <LogoutIcon className="w-4 h-4" />
                      <span className="text-sm">로그아웃</span>
                    </Button>
                  </div>
                </ThemeDiv>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ThemeDiv>
      {/* PC: 고정 사이드바 */}
      <div className={`hidden md:block transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-0 overflow-hidden'}`}>
        <AdminSidebar open={sidebarOpen} onToggle={() => setSidebarOpen((v) => !v)} />
      </div>
      {/* 모바일 드로어 */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full z-40 bg-black/30 md:hidden"
              style={{ height: 'calc(100vh - 64px)' }}
              onClick={() => setDrawerOpen(false)}
            />
            {/* 드로어 */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full z-50 md:hidden"
            >
              <AdminSidebar variant="drawer" onClose={() => setDrawerOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHeader;