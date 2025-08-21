'use client'

import { motion } from "framer-motion";
import { bottomUp } from "@/types/ui/motionVariants";
import { EventStatus } from "@/types/model/events";
import Button from "@/components/base/Button";
import { StatusNoticeBox } from "@/components/status/StatusNoticeBox";

interface EventActionProps {
	status: EventStatus;
	isSoldOut: boolean;
	theme: string;
	onReservationClick: () => void;
}

// 공연 상세 하단
const EventAction = ({
	status,
	isSoldOut,
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
				<StatusNoticeBox status={EventStatus.Completed} theme={theme}>
					<p className="font-medium">완료된 공연입니다.</p>
				</StatusNoticeBox>
			) : status === EventStatus.Pending ? (
				<StatusNoticeBox status={EventStatus.Pending} theme={theme}>
					<p className="font-medium">대기중인 공연입니다.</p>
				</StatusNoticeBox>
			) : isSoldOut ? (
				<StatusNoticeBox status={EventStatus.SoldOut} theme={theme}>
					<p className="font-medium">매진되었습니다.</p>
				</StatusNoticeBox>
			) : (
				<Button
					theme="dark"
					width="w-full"
					fontSize="text-lg md:text-xl"
					padding="px-6 py-3"
					onClick={onReservationClick}
					reverse={theme === "normal"}
					light={theme !== "normal"}
					className="font-semibold"
				>
					예매하기
				</Button>
			)}
		</motion.div>
	);
};

export default EventAction; 