import clsx from "clsx";
import { EventStatus, EventStatusKo } from "@/types/model/events";

interface StatusBadgeProps {
  status: EventStatus;
  theme: string;
  className?: string;
}

export function StatusBadge({ status, theme, className = "" }: StatusBadgeProps) {
  const colorClass =
    status === EventStatus.Ongoing
      ? theme === "normal"
        ? "bg-green-100 text-green-800"
        : "bg-green-900/30 text-green-300"
      : status === EventStatus.Pending
      ? theme === "normal"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-yellow-900/30 text-yellow-300"
      : status === EventStatus.Completed
      ? theme === "normal"
        ? "bg-blue-100 text-blue-800"
        : "bg-blue-900/30 text-blue-300"
      : theme === "normal"
      ? "bg-red-100 text-red-800"
      : "bg-red-900/30 text-red-300";

  return (
    <span className={clsx("inline-block px-2 py-1 rounded text-sm font-medium", colorClass, className)}>
      {EventStatusKo[status]}
    </span>
  );
} 