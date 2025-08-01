'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
	const searchParams = useSearchParams();
	const [eventDateFrom, setEventDateFrom] = useState('');
	const [eventDateTo, setEventDateTo] = useState('');
	const [keyword, setKeyword] = useState('');
	const [status, setStatus] = useState<EventStatus | ''>('');

	// URL 파라미터에서 status 값을 가져와서 초기 상태 설정
	useEffect(() => {
		const statusParam = searchParams.get('status');
		if (statusParam && Object.values(EventStatus).includes(statusParam as EventStatus)) {
			setStatus(statusParam as EventStatus);
		}
	}, [searchParams]);

	// URL 파라미터가 있으면 SearchBar를 자동으로 열기
	const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
	useEffect(() => {
		const statusParam = searchParams.get('status');
		if (statusParam && Object.values(EventStatus).includes(statusParam as EventStatus)) {
			setIsSearchBarOpen(true);
		}
	}, [searchParams]);

	return (
		<motion.div
			variants={fadeSlideLeft}
			initial="hidden"
			animate="visible"
			className="space-y-4 md:space-y-6"
		>
			<div className="text-center mb-3 md:mb-4">
				<AnimatedText
					fontSize="text-lg md:text-lg"
					text="다양한 공연을 찾아보세요!"
					delay={0.3}
				/>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<ThemeDiv isChildren className="p-3 md:p-4 rounded-lg border" neonVariant='cyan'>
					<SearchBar
						initialOpen={isSearchBarOpen}
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