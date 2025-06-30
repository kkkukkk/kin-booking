'use client'

import { useParams, useRouter } from "next/navigation";
import { useEventById } from "@/hooks/api/useEvents";
import { useEventMediaByType } from "@/hooks/api/useEventMedia";
import { useSpinner } from "@/providers/SpinnerProvider";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Button from "@/components/base/Button";
import { motion } from "framer-motion";
import { fadeSlideLeft, bottomUp } from "@/types/ui/motionVariants";
import AnimatedTextWithIcon from "@/components/base/AnimatedTextWithIcon";
import { ArrowLeftIcon } from "@/components/icon/ArrowLeftIcon";
import { BulbIcon } from "@/components/icon/BulbIcon";
import ThemeDiv from "@/components/base/ThemeDiv";
import EventHeader from "./EventHeader";
import EventPoster from "./EventPoster";
import EventBasicInfo from "./EventBasicInfo";
import EventSeatInfo from "./EventSeatInfo";
import EventNotice from "./EventNotice";
import EventAction from "./EventAction";
import EventError from "./EventError";
import EventDescription from "./EventDescription";

const EventDetailClient = () => {
	const router = useRouter();
	const eventId = useParams().eventId as string;
	const theme = useAppSelector((state: RootState) => state.theme.current);

	const { data, isLoading, error } = useEventById(eventId);
	const { data: posterData } = useEventMediaByType(eventId, 'image');
	const { showSpinner, hideSpinner } = useSpinner();

	useEffect(() => {
		if (isLoading) showSpinner();
		else hideSpinner();
	}, [isLoading, showSpinner, hideSpinner]);

	useEffect(() => {
		if (!isLoading && data) {
			setTimeout(() => {
				window.dispatchEvent(new Event('resize'));
			}, 100);
		}
	}, [isLoading, data]);

	// 에러 상태
	if (error) {
		return (
			<EventError
				theme={theme}
				onRetry={() => window.location.reload()}
				onGoToList={() => router.push("/events")}
			/>
		);
	}

	if (!data) return null;

	const event = data;

	return (
		<div className="p-4">
			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				className="mb-6"
			>
				<Button
					theme="dark"
					padding="px-3 py-1.5"
					onClick={() => router.push("/events")}
					reverse={theme === "normal"}
					light={theme !== "normal"}
				>
					<span className="mr-1">
						<ArrowLeftIcon />
					</span>
					뒤로가기
				</Button>
			</motion.div>

			<div className="space-y-5 flex flex-col">
				<EventHeader 
					eventName={event.eventName}
					status={event.status}
					theme={theme}
				/>

				<motion.div
					variants={fadeSlideLeft}
					initial="hidden"
					animate="visible"
					transition={{ delay: 0.15 }}
					className="flex flex-col md:flex-row md:gap-8 md:items-start"
				>
					<div className="flex justify-center mb-5 md:mb-0 md:flex-shrink-0">
						<div className="relative w-full max-w-md md:w-80">
							<EventPoster
								posterData={posterData}
								eventName={event.eventName}
								theme={theme}
								isLoading={isLoading}
							/>
						</div>
					</div>

					<div className="flex-1">
						<ThemeDiv isChildren className="p-4 rounded-lg border">
							<div className="space-y-2">
								<EventBasicInfo
									eventDate={event.eventDate}
									location={event.location}
									ticketPrice={event.ticketPrice}
									theme={theme}
								/>

								<EventSeatInfo
									status={event.status}
									seatCapacity={event.seatCapacity}
									reservedQuantity={event.reservedQuantity}
									remainingQuantity={event.remainingQuantity}
									isSoldOut={event.isSoldOut}
									theme={theme}
								/>

								<EventNotice theme={theme} />
							</div>
						</ThemeDiv>
					</div>
				</motion.div>

				{event.description && (
					<motion.div
						variants={fadeSlideLeft}
						initial="hidden"
						animate="visible"
						transition={{ delay: 0.3 }}
						className="space-y-2"
					>
						<AnimatedTextWithIcon
							fontSize="text-lg md:text-xl"
							text="소개"
							leftIcon={<BulbIcon />}
						/>
						<ThemeDiv isChildren className="p-4 rounded-lg border">
							<EventDescription description={event.description} />
						</ThemeDiv>
					</motion.div>
				)}

				<motion.div
					variants={bottomUp}
					initial="initial"
					animate="animate"
					transition={{ delay: 0.4 }}
					className="mt-4"
				>
					<EventAction
						status={event.status}
						isSoldOut={event.isSoldOut}
						eventId={event.eventId}
						theme={theme}
						onReservationClick={() => router.push(`/events/${event.eventId}/reservation`)}
					/>
				</motion.div>
			</div>
		</div>
	);
};

export default EventDetailClient;