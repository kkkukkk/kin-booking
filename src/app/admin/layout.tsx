import AdminHeader from './components/AdminHeader';
import { AdminSidebarProvider } from '../../providers/AdminSidebarProvider';
import React from 'react';
import styles from '@/css/admin-layout.module.css';
import AdminSidebarWithContext from './components/AdminSidebarWithContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminSidebarProvider>
      <div className={styles['admin-layout']}>
        <header className={styles.header}>
          <AdminHeader />
        </header>
        <aside className={styles.sidebar}>
          <AdminSidebarWithContext />
        </aside>
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </AdminSidebarProvider>
  );
}