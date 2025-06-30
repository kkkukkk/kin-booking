'use client'

import React, {useEffect, useState, useRef} from 'react';
import dayjs, {Dayjs} from "dayjs";
import clsx from "clsx";
import {useAppSelector} from "@/redux/hooks";
import styles from '@/css/module/date-picker.module.css';
import ThemeDiv from "@/components/base/ThemeDiv";

interface DatePickerProps {
	initialFrom?: Dayjs;
	initialTo?: Dayjs;
	onChange?: (from: Dayjs, to: Dayjs) => void;
}

const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

const generateCalendar = (date: Dayjs): Dayjs[][] => {
	const startOfMonth = date.startOf('month');
	const daysInMonth = date.daysInMonth();

	const prevMonth = date.subtract(1, 'month');
	const daysInPrevMonth = prevMonth.daysInMonth();

	const startDay = startOfMonth.day();

	const calendar: Dayjs[][] = [];
	let week: Dayjs[] = [];

	// 이전 달 날짜 채우기
	for (let i = startDay - 1; i >= 0; i--) {
		week.push(prevMonth.date(daysInPrevMonth - i));
	}

	// 이번 달 날짜 채우기
	for (let day = 1; day <= daysInMonth; day++) {
		week.push(date.date(day));
		if (week.length === 7) {
			calendar.push(week);
			week = [];
		}
	}

	// 다음 달 날짜 채우기 (빈칸 채우기)
	let nextMonthDay = 1;
	while (week.length < 7) {
		const nextMonth = date.add(1, 'month');
		week.push(nextMonth.date(nextMonthDay++));
	}
	calendar.push(week);

	return calendar;
};

const DRAG_THRESHOLD = 120; // ms, 이 시간 이상 누르면 드래그로 간주

const DatePicker = ({ onChange, initialFrom, initialTo}: DatePickerProps) => {
	const theme = useAppSelector(state => state.theme.current);
	const [startDate, setStartDate] = useState<Dayjs | null>(initialFrom ?? null);
	const [endDate, setEndDate] = useState<Dayjs | null>(initialTo ?? null);
	const [currentDate, setCurrentDate] = useState(
		initialFrom ?? dayjs()
	);

	const calendar = generateCalendar(currentDate);

	const isSameDay = (a: Dayjs | null, b: Dayjs | null): boolean =>
		Boolean(a && b && a.format('YYYY-MM-DD') === b.format('YYYY-MM-DD'));

	const handleDateClick = (day: Dayjs) => {
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
			if (onChange) {
				onChange(day, day);
			}
		} else {
			setEndDate(day);
			if (onChange && startDate) {
				onChange(startDate, day);
			}
		}
	};


	const isInRange = (day: Dayjs) => {
		if (!startDate || !endDate) return false;
		return day.isAfter(startDate) && day.isBefore(endDate);
	};

	const isSelected = (day: Dayjs) => {
		if (startDate && endDate) {
			return day.isSame(startDate, 'day') || day.isSame(endDate, 'day');
		}
		if (startDate && !endDate) {
			return day.isSame(startDate, 'day');
		}
		return false;
	};
	const isToday = (day: Dayjs) => day.isSame(dayjs(), 'day');

	const getCellClass = (
		day: Dayjs,
		isStart: boolean,
		isEnd: boolean,
		inRange: boolean,
		isOtherMonth: boolean,
	): string => {
		if (isToday(day)) {
			if (theme === 'normal') return styles.normalToday;
			if (theme === 'dark') return styles.darkToday;
			if (theme === 'neon') return styles.neonToday;
		}
		if (isStart || isEnd) {
			if (theme === 'normal') return styles.normalSelected;
			if (theme === 'dark') return styles.darkSelected;
			if (theme === 'neon') return styles.neonSelected;
		}
		if (inRange) {
			if (theme === 'normal') return styles.normalInRange;
			if (theme === 'dark') return styles.darkInRange;
			if (theme === 'neon') return styles.neonInRange;
		}
		if (isOtherMonth) {
			if (theme === 'normal') return styles.otherMonthNormal;
			if (theme === 'dark') return styles.otherMonthDark;
			if (theme === 'neon') return styles.otherMonthNeon;
		}
		if (theme === 'normal') return styles.normalLight;
		if (theme === 'dark') return styles.darkLight;
		if (theme === 'neon') return styles.neonLight;
		return styles.normalLight;
	};

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
			<div className="flex justify-between items-center mb-2">
				<button onClick={() => setCurrentDate(prev => prev.subtract(1, 'month'))}>◀</button>
				<span>{currentDate.format('YYYY년 MM월')}</span>
				<button onClick={() => setCurrentDate(prev => prev.add(1, 'month'))}>▶</button>
			</div>

			<div className="grid grid-cols-7 text-center font-bold text-sm">
				{weekdays.map((day, idx) => (
					<div
						key={day}
						className={clsx(
							styles.weekday,
							idx === 0 && styles.sunday,
							idx === 6 && styles.saturday
						)}
					>
						{day}
					</div>
				))}
			</div>

			<div className="grid grid-cols-7 text-center">
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
									className={clsx(
										styles.cell,
										getCellClass(day, isStart, isEnd, inRange, isOtherMonth),
										isSelected(day) && 'selected',
										isInRange(day) && 'in-range',
										isToday(day) && 'today'
									)}
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