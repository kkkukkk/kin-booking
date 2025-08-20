"use client";
import { createContext, useContext, useState } from "react";

interface AdminSidebarContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export function useAdminSidebar() {
  const ctx = useContext(AdminSidebarContext);
  if (!ctx) throw new Error("useAdminSidebar must be used within AdminSidebarProvider");
  return ctx;
}

export function AdminSidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <AdminSidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </AdminSidebarContext.Provider>
  );
} 