'use client';

import { usePathname } from 'next/navigation';
import ThemeDiv from '@/components/base/ThemeDiv';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminSidebarProps {
  variant?: 'sidebar' | 'drawer';
  open?: boolean;
  onClose?: () => void;
  sidebarOpen?: boolean;
  onToggle?: () => void;
}

const SIDEBAR_WIDTH = 240; // px

const AdminSidebar = ({ variant = 'sidebar', open = true, onClose, sidebarOpen = true, onToggle }: AdminSidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: '대시보드' },
    { href: '/admin/users', label: '사용자 관리' },
    { href: '/admin/events', label: '공연 관리' },
    { href: '/admin/reservations', label: '예매 관리' },
    { href: '/admin/tickets', label: '티켓 관리' },
  ];

  return (
    <motion.div
      animate={{ width: variant === 'sidebar' ? (sidebarOpen ? SIDEBAR_WIDTH : 0) : '100%' }}
      transition={{ type: 'tween', duration: 0.3 }}
      className="h-full flex flex-col overflow-hidden"
      style={{ minWidth: 0 }}
    >
      <ThemeDiv className="h-full flex flex-col overflow-hidden">
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.div
              key="sidebar-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, delay: sidebarOpen ? 0.3 : 0 }}
              className="h-full flex flex-col"
            >
              {/* 헤더 */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h1 className="text-xl font-bold transition-all duration-300 opacity-100">관리자</h1>
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
                          : 'text-gray-800 hover:bg-green-500/10 hover:text-green-400'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </ThemeDiv>
    </motion.div>
  );
};

export default AdminSidebar; 