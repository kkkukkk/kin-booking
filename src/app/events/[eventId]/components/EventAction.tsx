'use client'

import { motion } from "framer-motion";
import { bottomUp } from "@/types/ui/motionVariants";
import { EventStatus } from "@/types/model/events";
import Button from "@/components/base/Button";
import clsx from "clsx";

interface EventActionProps {
	status: EventStatus;
	isSoldOut: boolean;
	eventId: string;
	theme: string;
	onReservationClick: () => void;
}

const EventAction = ({ 
	status, 
	isSoldOut, 
	eventId, 
	theme, 
	onReservationClick 
}: EventActionProps) => {
	return (
		<motion.div
			variants={bottomUp}
			initial="initial"
			animate="animate"
			transition={{ delay: 0.4 }}
		>
			{status === EventStatus.Completed ? (
				<div className={clsx(
					"p-4 rounded-lg text-center border-2 border-dashed",
					theme === "normal" 
						? "bg-gray-50 border-gray-200 text-gray-700" 
						: "bg-gray-800 border-gray-700 text-gray-300"
				)}>
					<p className="font-medium">완료된 공연입니다.</p>
				</div>
			) : status === EventStatus.Pending ? (
				<div className={clsx(
					"p-4 rounded-lg text-center border-2 border-dashed",
					theme === "normal" 
						? "bg-yellow-50 border-yellow-200 text-yellow-700" 
						: "bg-yellow-900/20 border-yellow-700 text-yellow-300"
				)}>
					<p className="font-medium">대기중인 공연입니다.</p>
				</div>
			) : isSoldOut ? (
				<div className={clsx(
					"p-4 rounded-lg text-center border-2 border-dashed",
					theme === "normal" 
						? "bg-red-50 border-red-200 text-red-700" 
						: "bg-red-900/20 border-red-700 text-red-300"
				)}>
					<p className="font-medium">매진되었습니다.</p>
				</div>
			) : (
				<Button
					theme="dark"
					width="w-full"
					fontSize="text-lg md:text-xl"
					padding="px-6 py-3"
					onClick={onReservationClick}
					reverse={theme === "normal"}
					light={theme !== "normal"}
				>
					예매하기
				</Button>
			)}
		</motion.div>
	);
};

export default EventAction; 