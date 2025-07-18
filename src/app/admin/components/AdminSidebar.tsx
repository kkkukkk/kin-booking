'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeDiv from '@/components/base/ThemeDiv';
import Button from '@/components/base/Button';
import { CloseIcon } from '@/components/icon/CloseIcon';

interface AdminSidebarProps {
  variant?: 'sidebar' | 'drawer';
  open?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
}

const AdminSidebar = ({ variant = 'sidebar', open = true, onToggle, onClose }: AdminSidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: '대시보드' },
    { href: '/admin/users', label: '사용자 관리' },
    { href: '/admin/events', label: '공연 관리' },
    { href: '/admin/reservations', label: '예매 관리' },
    { href: '/admin/tickets', label: '티켓 관리' },
  ];

  return (
    <ThemeDiv
      className={`h-full flex flex-col transition-all duration-300 ${
        variant === 'sidebar' ? (open ? 'w-60' : 'w-14') : ''
      }`}
      isChildren
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h1 className={`text-xl font-bold transition-all duration-300 ${variant === 'sidebar' && !open ? 'opacity-0 w-0' : 'opacity-100'}`}>관리자</h1>
        {/* PC: 토글 버튼 */}
        {variant === 'sidebar' && (
          <Button
            onClick={onToggle}
            theme="dark"
            padding="p-2"
            className="hidden md:inline-flex"
            aria-label="사이드바 토글"
          >
            {/* 아이콘은 필요에 따라 교체 */}
            <span className="w-4 h-4">≡</span>
          </Button>
        )}
        {/* 드로어(모바일)에서만 닫기 버튼 */}
        {variant === 'drawer' && onClose && (
          <Button
            onClick={onClose}
            theme="dark"
            padding="p-2"
            className="md:hidden"
            aria-label="메뉴 닫기"
          >
            <CloseIcon />
          </Button>
        )}
      </div>
      {/* 네비게이션 */}
      <nav className="flex-1 p-4">
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                pathname === item.href
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'text-gray-300 hover:bg-green-500/10 hover:text-green-400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </ThemeDiv>
  );
};

export default AdminSidebar; 