import AdminHeader from './components/AdminHeader';
import React from 'react';
import styles from '@/css/module/admin-layout.module.css';
import { AdminSidebarProvider } from '@/providers/AdminSidebarProvider';
import AdminSidebar from './components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSidebarProvider>
      <div className={styles['admin-layout']}>
        <header className={styles.header}>
          <AdminHeader />
        </header>
        <aside className={styles.sidebar}>
          <AdminSidebar variant="sidebar" />
        </aside>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </AdminSidebarProvider>
  );
}