'use client'

import { useEventsWithCurrentStatus } from "@/hooks/api/useEvents";
import { useSpinner } from "@/hooks/useSpinner";
import { useEffect, useState, useMemo, useRef } from "react";
import { EventStatus } from "@/types/model/events";
import EventCard from "./EventCard";
import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import AnimatedText from "@/components/base/AnimatedText";
import ResponsivePagination from "@/components/pagination/ResponsivePagination";
import { getPaginationResponse } from "@/util/pagination/pagination";
import SortSelector from "@/components/sort/SortSelector";
import { SortConfig } from "@/types/ui/sort";
import { sortEvents } from "@/util/eventSort";

interface EventListProps {
	className?: string;
	keyword?: string;
	status?: EventStatus;
	from?: string;
	to?: string;
}

const EventList = ({ className, keyword, status, from, to }: EventListProps) => {
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize] = useState(12); // 한 페이지당 12개 공연
	const { showSpinner, hideSpinner } = useSpinner();
	const [sortConfig, setSortConfig] = useState<SortConfig>({
		field: 'date',
		direction: 'asc'
	});

	// params 객체를 useMemo로 감싸기
	const params = useMemo(() => ({
		eventName: keyword,
		eventDateFrom: from,
		eventDateTo: to,
		status: status,
		page: currentPage,
		size: pageSize
	}), [keyword, from, to, status, currentPage, pageSize]);

	const { data, isLoading, isFetching, error } = useEventsWithCurrentStatus(params);

	const prevIsFetching = useRef(false);

	useEffect(() => {
		if (!prevIsFetching.current && isFetching) {
			showSpinner();
		}
		if (prevIsFetching.current && !isFetching) {
			hideSpinner();
		}
		prevIsFetching.current = isFetching;
	}, [isFetching, showSpinner, hideSpinner]);

	// 검색 조건이 변경되면 첫 페이지로 리셋
	useEffect(() => {
		setCurrentPage(1);
	}, [keyword, status, from, to]);

	if (error) {
		return (
			<div className="text-center py-6 md:py-8">
				<AnimatedText
					fontSize="text-base md:text-lg"
					text="공연 목록을 불러오는 중 오류가 발생했습니다."
				/>
			</div>
		);
	}

	const events = data?.data ?? [];
	const totalCount = data?.totalCount ?? 0;
	
	// 정렬된 이벤트 목록
	const sortedEvents = useMemo(() => {
		return sortEvents(events, sortConfig);
	}, [events, sortConfig]);
	
	// 페이지네이션 값 가져옴
	const paginationInfo = getPaginationResponse(
		{ page: currentPage, size: pageSize },
		totalCount
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		// 페이지 상단으로 스크롤
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleLoadMore = () => {
		setCurrentPage(prev => prev + 1);
	};

	const handleSortChange = (newSortConfig: SortConfig) => {
		setSortConfig(newSortConfig);
	};

	return (
		<motion.div
			variants={fadeSlideLeft}
			initial="hidden"
			animate="visible"
			className={className}
		>
			{/* 모바일용 정렬 */}
			<div className="md:hidden mb-4">
				<SortSelector
					sortConfig={sortConfig}
					onSortChange={handleSortChange}
				/>
			</div>

			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center space-x-1 md:space-x-2">
					<span className="text-base md:text-lg">
						공연 목록 ({totalCount}건)
					</span>
				</div>
				
				{/* 정렬 */}
				<SortSelector
					sortConfig={sortConfig}
					onSortChange={handleSortChange}
					className="hidden md:flex"
				/>
			</div>

			{sortedEvents.length === 0 ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="text-center py-8 md:py-12"
				>
					<AnimatedText
						fontSize="text-base md:text-lg"
						text="등록된 공연이 없습니다."
					/>
				</motion.div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
					{sortedEvents.map((event, index) => (
						<EventCard
							key={event.eventId}
							event={event}
							index={index}
						/>
					))}
				</div>
			)}

			{/* 페이지네이션 */}
			<ResponsivePagination
				paginationInfo={paginationInfo}
				onPageChange={handlePageChange}
				onLoadMore={handleLoadMore}
				isLoading={isLoading}
				loadMoreText="더 많은 공연 보기"
				loadingText="불러오는 중..."
				noMoreText="모든 공연을 불러왔습니다"
			/>
		</motion.div>
	);
};

export default EventList;