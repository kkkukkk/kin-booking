import clsx from "clsx";
import { EventStatus } from "@/types/model/events";
import { ReactNode } from "react";

interface StatusNoticeBoxProps {
  status: EventStatus;
  theme: string;
  children: ReactNode;
  className?: string;
}

export function StatusNoticeBox({ status, theme, children, className = "" }: StatusNoticeBoxProps) {
  let colorClass = "";
  switch (status) {
    case EventStatus.Completed:
      colorClass = theme === "normal"
        ? "bg-blue-50 border-blue-200 text-blue-700"
        : "bg-blue-900/20 border-blue-700 text-blue-300";
      break;
    case EventStatus.Pending:
      colorClass = theme === "normal"
        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
        : "bg-yellow-900/20 border-yellow-700 text-yellow-300";
      break;
    case EventStatus.SoldOut:
      colorClass = theme === "normal"
        ? "bg-red-50 border-red-200 text-red-700"
        : "bg-red-900/20 border-red-700 text-red-300";
      break;
    default:
      colorClass = theme === "normal"
        ? "bg-gray-50 border-gray-200 text-gray-700"
        : "bg-gray-800 border-gray-700 text-gray-300";
  }
  return (
    <div className={clsx(
      "p-4 rounded-lg text-center border-2 border-dashed",
      colorClass,
      className
    )}>
      {children}
    </div>
  );
} 