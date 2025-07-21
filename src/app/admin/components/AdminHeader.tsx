'use client';

import { useSession } from '@/hooks/useSession';
import { useUserById } from '@/hooks/api/useUsers';
import { useRouter } from 'next/navigation';
import { UsersIcon } from '@/components/icon/FriendIcons';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { RootState } from '@/redux/store';
import { useAppSelector } from '@/redux/hooks';
import Logo from '@/components/Logo';
import { useState } from 'react';
import { useLogout } from '@/hooks/api/useAuth';
import { useAlert } from '@/providers/AlertProvider';
import useToast from '@/hooks/useToast';
import { useAdminSidebar } from '@/providers/AdminSidebarProvider';
import AdminDropDownMenu from './AdminDropDownMenu';
import AdminUserInfo from './AdminUserInfo';

const AdminHeader = () => {
  const theme = useAppSelector((state: RootState) => state.theme.current);
  const { session } = useSession();
  const router = useRouter();
  const { data: user } = useUserById(session?.user?.id || '');
  const { mutate: logout } = useLogout();
  const { showAlert } = useAlert();
  const { showToast } = useToast();
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { open, setOpen } = useAdminSidebar();

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
            on={false}
            onClick={() => setOpen(!open)}
            theme={theme}
            className="md:hidden"
            aria-label="메뉴 열기"
          />
          {/* PC: 사이드바 토글 버튼 */}
          <Button
            variant="hamburger"
            on={open}
            onClick={() => setOpen(!open)}
            theme={theme}
            className="hidden md:inline-flex"
            aria-label="사이드바 토글"
          />
          <Logo width={60} className="md:w-[75px]" priority={true} />
          <div className="text-lg font-bold whitespace-nowrap md:text-2xl">
            관리자 패널
          </div>
        </div>
        <div className="relative">
          <Button
            onClick={toggleUserDropdown}
            theme={theme}
            padding="p-2"
            className="flex items-center justify-center"
            aria-label="사용자 메뉴"
          >
            <UsersIcon className="w-5 h-5" />
          </Button>
          {/* 관리자 정보 */}
          <AdminUserInfo
            user={user}
            session={session}
            theme={theme as any}
            handleLogout={handleLogout}
            isOpen={isUserDropdownOpen}
            onClose={() => setIsUserDropdownOpen(false)}
          />
        </div>
      </ThemeDiv>
      <AdminDropDownMenu open={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default AdminHeader;