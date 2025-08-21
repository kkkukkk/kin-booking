'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import dayjs, { Dayjs } from "dayjs";
import clsx from "clsx";
import { useAppSelector } from "@/redux/hooks";
import ThemeDiv from "@/components/base/ThemeDiv";

interface DatePickerProps {
	initialFrom?: Dayjs;
	initialTo?: Dayjs;
	onChange?: (from: Dayjs, to: Dayjs) => void;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const DatePicker = ({ onChange, initialFrom, initialTo }: DatePickerProps) => {
	const theme = useAppSelector(state => state.theme.current);
	const [startDate, setStartDate] = useState<Dayjs | null>(initialFrom ?? null);
	const [endDate, setEndDate] = useState<Dayjs | null>(initialTo ?? null);
	const [currentDate, setCurrentDate] = useState(initialFrom ?? dayjs());

	// 캘린더 생성 최적화
	const calendar = useMemo(() => {
		const startOfMonth = currentDate.startOf('month');
		const daysInMonth = currentDate.daysInMonth();
		const prevMonth = currentDate.subtract(1, 'month');
		const daysInPrevMonth = prevMonth.daysInMonth();
		const startDay = startOfMonth.day();

		const calendar: Dayjs[][] = [];
		let week: Dayjs[] = [];

		// 이전 달 날짜
		for (let i = startDay - 1; i >= 0; i--) {
			week.push(prevMonth.date(daysInPrevMonth - i));
		}

		// 이번 달 날짜
		for (let day = 1; day <= daysInMonth; day++) {
			week.push(currentDate.date(day));
			if (week.length === 7) {
				calendar.push(week);
				week = [];
			}
		}

		// 다음 달 날짜
		let nextMonthDay = 1;
		while (week.length < 7) {
			const nextMonth = currentDate.add(1, 'month');
			week.push(nextMonth.date(nextMonthDay++));
		}
		calendar.push(week);

		return calendar;
	}, [currentDate]);

	// 유틸리티 함수들 최적화
	const isSameDay = useCallback((a: Dayjs | null, b: Dayjs | null): boolean =>
		Boolean(a && b && a.format('YYYY-MM-DD') === b.format('YYYY-MM-DD')), []);

	const isToday = useCallback((day: Dayjs) => day.isSame(dayjs(), 'day'), []);

	const isInRange = useCallback((day: Dayjs) => {
		if (!startDate || !endDate) return false;
		return day.isAfter(startDate) && day.isBefore(endDate);
	}, [startDate, endDate]);

	const isSelected = useCallback((day: Dayjs) => {
		if (startDate && endDate) {
			return day.isSame(startDate, 'day') || day.isSame(endDate, 'day');
		}
		if (startDate && !endDate) {
			return day.isSame(startDate, 'day');
		}
		return false;
	}, [startDate, endDate]);

	// 날짜 클릭 핸들러 최적화
	const handleDateClick = useCallback((day: Dayjs) => {
		if (day.month() !== currentDate.month()) {
			setCurrentDate(day.startOf('month'));
		}

		if (!startDate || (startDate && endDate)) {
			setStartDate(day);
			setEndDate(null);
		} else if (day.isBefore(startDate)) {
			setStartDate(day);
		} else if (isSameDay(day, startDate)) {
			setEndDate(day);
			onChange?.(day, day);
		} else {
			setEndDate(day);
			if (startDate) {
				onChange?.(startDate, day);
			}
		}
	}, [startDate, endDate, currentDate, isSameDay, onChange]);

	// 월 변경 핸들러 최적화
	const handleMonthChange = useCallback((direction: 'prev' | 'next') => {
		setCurrentDate(prev => direction === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month'));
	}, []);

	// 스타일 클래스 생성 최적화
	const getCellStyles = useCallback((day: Dayjs, isStart: boolean, isEnd: boolean, inRange: boolean, isOtherMonth: boolean) => {
		const baseStyles = "w-8 h-8 flex items-center justify-center cursor-pointer transition-colors duration-150 text-xs";

		// 오늘 날짜
		if (isToday(day)) {
			if (theme === 'neon') {
				return clsx(baseStyles, "bg-[var(--neon-green)]/20 text-[var(--neon-green)] border border-[var(--neon-green)]/30 rounded");
			}
			if (theme === 'dark') {
				return clsx(baseStyles, "bg-gray-500/30 text-gray-300 border border-gray-400/50 rounded");
			}
			return clsx(baseStyles, "bg-green-200 text-green-700 border border-green-500 rounded font-semibold");
		}

		// 선택된 날짜 (시작/끝)
		if (isStart || isEnd) {
			if (theme === 'neon') {
				return clsx(baseStyles, "bg-[var(--neon-cyan)]/30 text-white border border-[var(--neon-cyan)]/50 shadow-[0_0_8px_var(--neon-cyan)]/30 rounded");
			}
			if (theme === 'dark') {
				return clsx(baseStyles, "bg-gray-600 text-white border border-gray-500 rounded");
			}
			return clsx(baseStyles, "bg-green-500 text-white border border-green-600 rounded");
		}

		// 범위 내 날짜
		if (inRange) {
			if (theme === 'neon') {
				return clsx(baseStyles, "bg-[var(--neon-cyan)]/10 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]/20");
			}
			if (theme === 'dark') {
				return clsx(baseStyles, "bg-gray-700/50 text-gray-300 border border-gray-600/50");
			}
			return clsx(baseStyles, "bg-green-50 text-green-700 border border-green-200");
		}

		// 다른 달 날짜
		if (isOtherMonth) {
			if (theme === 'neon') {
				return clsx(baseStyles, "text-gray-400/60 hover:text-gray-300/80");
			}
			if (theme === 'dark') {
				return clsx(baseStyles, "text-gray-500 hover:text-gray-400");
			}
			return clsx(baseStyles, "text-gray-400 hover:text-gray-600");
		}

		// 기본 날짜
		if (theme === 'neon') {
			return clsx(baseStyles, "text-gray-200 border border-transparent hover:text-white hover:bg-[var(--neon-green)]/10 hover:border-[var(--neon-green)]/30");
		}
		if (theme === 'dark') {
			return clsx(baseStyles, "text-gray-300 border border-transparent hover:text-white hover:bg-gray-600/50 hover:border-gray-500/50");
		}
		return clsx(baseStyles, "text-gray-700 border border-transparent hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300");
	}, [theme, isToday]);

	// 요일 헤더 스타일
	const getWeekdayStyles = useCallback((idx: number) => {
		const baseStyles = "w-8 h-8 flex items-center justify-center font-bold text-xs";

		if (theme === 'neon') {
			if (idx === 0) return clsx(baseStyles, "text-red-300"); // 일요일
			if (idx === 6) return clsx(baseStyles, "text-blue-300"); // 토요일
			return clsx(baseStyles, "text-gray-200");
		}

		if (theme === 'dark') {
			if (idx === 0) return clsx(baseStyles, "text-red-400"); // 일요일
			if (idx === 6) return clsx(baseStyles, "text-blue-400"); // 토요일
			return clsx(baseStyles, "text-gray-300");
		}

		if (idx === 0) return clsx(baseStyles, "text-red-500"); // 일요일
		if (idx === 6) return clsx(baseStyles, "text-blue-500"); // 토요일
		return clsx(baseStyles, "text-gray-700");
	}, [theme]);

	useEffect(() => {
		if (initialFrom) {
			setStartDate(initialFrom);
			setCurrentDate(initialFrom);
		}
		if (initialTo) {
			setEndDate(initialTo);
		}
	}, [initialFrom, initialTo]);

	return (
		<ThemeDiv className="p-4 rounded w-fit mx-auto shadow-md" isChildren>
			{/* 헤더 */}
			<div className="flex justify-between items-center mb-2">
				<button
					onClick={() => handleMonthChange('prev')}
					className="p-2 hover:bg-gray-100 rounded transition-colors"
				>
					◀
				</button>
				<span className={clsx(
					"text-base font-semibold",
					theme === 'neon' ? "text-gray-100" :
						theme === 'dark' ? "text-gray-200" : "text-gray-800"
				)}>
					{currentDate.format('YYYY년 MM월')}
				</span>
				<button
					onClick={() => handleMonthChange('next')}
					className="p-2 hover:bg-gray-100 rounded transition-colors"
				>
					▶
				</button>
			</div>

			{/* 요일 헤더 */}
			<div className="grid grid-cols-7 text-center font-bold text-sm">
				{weekdays.map((day, idx) => (
					<div key={day} className={getWeekdayStyles(idx)}>
						{day}
					</div>
				))}
			</div>

			{/* 캘린더 그리드 */}
			<div className="grid grid-cols-7 gap-0.5">
				{calendar.map((week, weekIndex) => (
					<React.Fragment key={weekIndex}>
						{week.map((day, dayIndex) => {
							const isStart = isSameDay(day, startDate);
							const isEnd = isSameDay(day, endDate);
							const inRange = isInRange(day);
							const isOtherMonth = day.month() !== currentDate.month();

							return (
								<div
									key={dayIndex}
									className={getCellStyles(day, isStart, isEnd, inRange, isOtherMonth)}
									onClick={() => handleDateClick(day)}
								>
									{day.date()}
								</div>
							);
						})}
					</React.Fragment>
				))}
			</div>
		</ThemeDiv>
	);
};

export default DatePicker;