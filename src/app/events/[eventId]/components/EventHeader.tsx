'use client'

import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import { EventStatus, EventStatusKo } from "@/types/model/events";
import clsx from "clsx";

interface EventHeaderProps {
	eventName: string;
	status: EventStatus;
	theme: string;
}

const EventHeader = ({ eventName, status, theme }: EventHeaderProps) => {
	return (
		<motion.div
			variants={fadeSlideLeft}
			initial="hidden"
			animate="visible"
			transition={{ delay: 0.1 }}
			className="flex justify-between items-center"
		>
			<h1 className="text-2xl md:text-3xl font-bold flex-1">
				{eventName}
			</h1>
			<div className={clsx(
				"inline-block px-2 py-1 rounded text-sm font-medium ml-4",
				status === EventStatus.Ongoing 
					? (theme === "normal" ? "bg-green-100 text-green-800" : "bg-green-900/30 text-green-300")
					: status === EventStatus.Pending
					? (theme === "normal" ? "bg-yellow-100 text-yellow-800" : "bg-yellow-900/30 text-yellow-300")
					: status === EventStatus.Completed
					? (theme === "normal" ? "bg-gray-100 text-gray-800" : "bg-gray-900/30 text-gray-300")
					: (theme === "normal" ? "bg-red-100 text-red-800" : "bg-red-900/30 text-red-300")
			)}>
				{EventStatusKo[status]}
			</div>
		</motion.div>
	);
};

export default EventHeader; 