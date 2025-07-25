"use client";
import AdminSidebar from "./AdminSidebar";
import { AnimatePresence, motion } from "framer-motion";
import { fadeSlideDownSm } from "@/types/ui/motionVariants";

interface AdminDropDownMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function AdminDropDownMenu({ open, onClose }: AdminDropDownMenuProps) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="absolute left-0 right-0 top-full bg-white shadow-lg border-b border-gray-200 md:hidden"
            style={{ zIndex: 50 }}
            variants={fadeSlideDownSm}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={e => e.stopPropagation()}
          >
            <AdminSidebar variant="dropdown" onClose={onClose} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 