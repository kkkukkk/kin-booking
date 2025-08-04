'use client'

import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import { EventStatus, EventStatusKo } from "@/types/model/events";
import clsx from "clsx";
import { StatusBadge } from "@/components/status/StatusBadge";

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
			<StatusBadge status={status} theme={theme} className="ml-4" statusType="event" />
		</motion.div>
	);
};

export default EventHeader; 