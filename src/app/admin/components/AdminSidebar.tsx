'use client';

import { usePathname } from 'next/navigation';
import ThemeDiv from '@/components/base/ThemeDiv';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAdminSidebar } from '@/providers/AdminSidebarProvider';


interface AdminSidebarProps {
  variant?: 'sidebar' | 'dropdown';
  onClose?: () => void;
}

const SIDEBAR_WIDTH = 240; // px

const AdminSidebar = ({ variant = 'sidebar', onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { open } = useAdminSidebar();

  const isSidebar = variant === 'sidebar';

  const navItems = [
    { href: '/admin', label: '대시보드' },
    { href: '/admin/users', label: '사용자 관리' },
    { href: '/admin/events', label: '공연 관리' },
    { href: '/admin/reservations', label: '예매 관리' },
    { href: '/admin/tickets', label: '티켓 관리' },
    { href: '/admin/payment-accounts', label: '계좌 관리' },
    { href: '/admin/payment-history', label: '입/출금 이력' },
    { href: '/admin/entry-check', label: '입장 확인' },
    { href: '/admin/qr-scanner', label: 'QR 스캔 (테스트)' },
  ];

  return (
    <motion.div
      animate={{ width: isSidebar ? (open ? SIDEBAR_WIDTH : 1) : '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="h-full flex flex-col overflow-hidden"
      style={{ minWidth: isSidebar ? 1 : 0 }}
    >
      <ThemeDiv className="h-full flex flex-col overflow-hidden">
        <motion.div
          key="sidebar-content"
          initial={false}
          animate={{ opacity: isSidebar ? (open ? 1 : 0) : (open ? 1 : 0) }}
          transition={{ duration: 0.15, delay: isSidebar && open ? 0.3 : 0 }}
          className="h-full flex flex-col"
          style={{ pointerEvents: isSidebar ? (open ? 'auto' : 'none') : 'auto' }}
          aria-hidden={isSidebar && !open}
        >
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h1 className="text-xl font-bold transition-all duration-300 opacity-100">관리자 메뉴</h1>
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
                      : 'hover:bg-green-500/10 hover:text-green-400 border border-transparent'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        </motion.div>
      </ThemeDiv>
    </motion.div>
  );
};

export default AdminSidebar; 