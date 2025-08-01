import { motion, AnimatePresence } from 'framer-motion';
import ThemeDiv from '@/components/base/ThemeDiv';
import clsx from 'clsx';
import UserInfo from '@/components/user/UserInfo';
import Button from '@/components/base/Button';
import { LogoutIcon } from '@/components/icon/LogoutIcon';
import { fadeSlideDownSm } from '@/types/ui/motionVariants';
import { Theme } from '@/types/ui/theme';

interface UserDropdownMenuProps {
  user: any;
  session: any;
  theme: Theme;
  handleLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminUserInfo({ user, session, theme, handleLogout, isOpen, onClose }: UserDropdownMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={fadeSlideDownSm}
          initial="hidden"
          animate="visible"
          exit="exit"
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
              <UserInfo
                name={user?.name || '관리자'}
                email={user?.email || session?.user?.email}
                theme={theme}
                avatarSize="sm"
              />
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
  );
} 