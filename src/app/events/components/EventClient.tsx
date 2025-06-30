'use client'

import React, { useState } from 'react';
import SearchBar from "@/components/search/SearchBar";
import EventList from "@/app/events/components/EventList";
import { EventStatus, EventStatusKo } from "@/types/model/events";
import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import AnimatedText from "@/components/base/AnimatedText";
import ThemeDiv from "@/components/base/ThemeDiv";

const statusOptions = [
	{ value: '', label: '전체' },
	...Object.values(EventStatus).map((status) => ({
		value: status,
		label: EventStatusKo[status],
	})),
] satisfies { value: EventStatus | ''; label: string }[];

const EventClient = () => {
	const [eventDateFrom, setEventDateFrom] = useState('');
	const [eventDateTo, setEventDateTo] = useState('');
	const [keyword, setKeyword] = useState('');
	const [status, setStatus] = useState<EventStatus | ''>('');

	return (
		<motion.div
			variants={fadeSlideLeft}
			initial="hidden"
			animate="visible"
			className="space-y-6"
		>
			{/* 헤더 */}
			<div className="text-center mb-4">
				<AnimatedText
					fontSize="text-base md:text-lg"
					text="다양한 공연을 찾아보세요"
					delay={0.3}
				/>
			</div>

			{/* 검색 및 필터 */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<ThemeDiv isChildren className="p-4 rounded-lg border">
					<SearchBar
						filters={{
							keyword: {
								value: keyword,
								onChange: setKeyword,
								placeholder: '공연 이름을 검색하세요',
							},
							dateRange: {
								from: eventDateFrom,
								to: eventDateTo,
								onChange: (from, to) => {
									setEventDateFrom(from);
									setEventDateTo(to);
								},
							},
							status: {
								value: status ?? '',
								onChange: (value: string) => setStatus(value as EventStatus | ''),
								options: statusOptions,
							},
						}}
					/>
				</ThemeDiv>
			</motion.div>

			{/* 공연 목록 */}
			<EventList
				keyword={keyword}
				status={status === '' ? undefined : status}
				from={eventDateFrom}
				to={eventDateTo}
			/>
		</motion.div>
	);
};

export default EventClient;