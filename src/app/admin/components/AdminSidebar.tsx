'use client';

import { usePathname } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import ThemeDiv from '@/components/base/ThemeDiv';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminSidebar } from '@/providers/AdminSidebarProvider';


interface AdminSidebarProps {
  variant?: 'sidebar' | 'dropdown';
  onClose?: () => void;
}

const SIDEBAR_WIDTH = 240; // px

const AdminSidebar = ({ variant = 'sidebar', onClose }: AdminSidebarProps) => {
  const pathname = usePathname();
  const { open } = useAdminSidebar();
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const isSidebar = variant === 'sidebar';

  const menuGroups = React.useMemo<Array<{
    id: string;
    label: string;
    href?: string;
    items: Array<{ href: string; label: string }>;
  }>>(() => [
    {
      id: 'dashboard',
      label: '대시보드',
      href: '/admin',
      items: []
    },
    {
      id: 'events',
      label: '공연 관리',
      items: [
        { href: '/admin/events', label: '공연 관리' },
        { href: '/admin/reservations', label: '예매 관리' },
        { href: '/admin/tickets', label: '티켓 관리' },
        { href: '/admin/transfer-history', label: '양도 이력' }
      ]
    },
    {
      id: 'users',
      label: '사용자 관리',
      items: [
        { href: '/admin/users', label: '사용자 관리' },
        { href: '/admin/team-members', label: '멤버 관리' }
      ]
    },
    {
      id: 'transactions',
      label: '거래 관리',
      items: [
        { href: '/admin/payment-accounts', label: '계좌 관리' },
        { href: '/admin/payment-history', label: '입/출금 이력' }
      ]
    },
    {
      id: 'operations',
      label: '도구',
      items: [
        { href: '/admin/entry-check', label: '입장 확인' },
        { href: '/admin/qr-scanner', label: 'QR 스캔' }
      ]
    },
    {
      id: 'system',
      label: '시스템',
      items: [
        { href: '/admin/settings', label: '설정' }
      ]
    }
  ], []);

  // 현재 경로에 해당하는 그룹 자동 펼치기
  useEffect(() => {
    const currentGroup = menuGroups.find(group => 
      group.items.some(item => item.href === pathname)
    );
    if (currentGroup) {
      setExpandedGroups(prev => new Set([...prev, currentGroup.id]));
    }
  }, [pathname, menuGroups]);

  // 그룹 토글 함수
  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

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
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-none">
            <div className="flex flex-col space-y-3">
              {menuGroups.map((group) => (
                <div key={group.id} className="space-y-1">
                  {group.items.length === 0 ? (
                    /* 대시보드: 대메뉴에 직접 링크 */
                    <Link
                      href={group.href!}
                      onClick={onClose}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 font-medium ${
                        pathname === group.href
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'hover:bg-green-500/10 hover:text-green-400 border border-transparent'
                      }`}
                    >
                      {group.label}
                    </Link>
                  ) : (
                    /* 일반 그룹: 아코디언 구조 */
                    <>
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors duration-200 font-medium ${
                          expandedGroups.has(group.id)
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'hover:bg-green-500/10 hover:text-green-400 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{group.label}</span>
                          <motion.div
                            animate={{ rotate: expandedGroups.has(group.id) ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm"
                          >
                            ›
                          </motion.div>
                        </div>
                      </button>
                      
                      {/* 소메뉴 */}
                      <AnimatePresence>
                        {expandedGroups.has(group.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 space-y-1 overflow-hidden"
                          >
                            {group.items.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`block px-3 py-2 rounded-lg transition-colors duration-200 text-sm ${
                                  pathname === item.href
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                    : 'hover:bg-green-500/5 hover:text-green-400 border border-transparent'
                                }`}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}
                </div>
              ))}
            </div>
          </nav>
        </motion.div>
      </ThemeDiv>
    </motion.div>
  );
};

export default AdminSidebar; 