'use client';
import { useAdminSidebar } from '@/providers/AdminSidebarProvider';
import AdminSidebar from './AdminSidebar';

export default function AdminSidebarWithContext() {
  const { open, setOpen } = useAdminSidebar();
  return <AdminSidebar variant="sidebar" sidebarOpen={open} onToggle={() => setOpen(!open)} />;
} 