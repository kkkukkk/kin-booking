'use client'

import DatePicker from "@/components/calendar/DatePicker";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import { AnimatePresence, motion } from "framer-motion";
import { fadeSlideDownSm } from "@/types/ui/motionVariants";
import dayjs from "dayjs";
import clsx from "clsx";
import styles from "@/css/module/search-bar.module.css";
import Select from "@/components/base/Select";
import useDebounce from "@/hooks/useDebounce";

interface SearchBarProps {
	filters: {
		keyword?: {
			value: string;
			onChange: (value: string) => void;
			placeholder?: string;
		};
		dateRange?: {
			from: string;
			to: string;
			onChange: (from: string, to: string) => void;
		};
		status?: {
			value: string;
			onChange: (value: string) => void;
			options: { value: string; label: string }[];
		};
	}
}

const SearchBar = ({ filters }: SearchBarProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [tempFrom, setTempFrom] = useState(filters.dateRange?.from ?? '');
	const [tempTo, setTempTo] = useState(filters.dateRange?.to ?? '');
	const [keyword, setKeyword] = useState(filters.keyword?.value ?? '');
	const [isOpen, setIsOpen] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);

	const debouncedKeyword = useDebounce(keyword, 300);

	useEffect(() => {
		if (filters.keyword && debouncedKeyword !== filters.keyword.value) {
			filters.keyword.onChange(debouncedKeyword);
		}
	}, [filters.keyword, debouncedKeyword]);

	const handleReset = () => {
		setTempFrom('');
		setTempTo('');
		setKeyword('');
		if (filters.dateRange) filters.dateRange.onChange('', '');
		if (filters.keyword) filters.keyword.onChange('');
		if (filters.status) filters.status.onChange('');
	};

	useEffect(() => {
		setTempFrom(filters.dateRange?.from ?? '');
		setTempTo(filters.dateRange?.to ?? '');
	}, [filters.dateRange?.from, filters.dateRange?.to]);


	return (
		<div
			className={"rounded text-sm flex flex-col"}
		>
			<Button
				theme={"dark"}
				width={"w-24"}
				padding={"py-1 md:py-0.5"}
				reverse={theme === "normal"}
				light={theme !== "normal"}
				className={"self-end"}
				onClick={() => {
					setIsOpen(prev => !prev);
					setShowDatePicker(false);
				}}
			>
				{isOpen ? "닫기" : "필터"}
			</Button>
			<AnimatePresence>
				{isOpen && (
					<motion.div
						key="search-form"
						layout
						initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
						animate={{
							opacity: 1,
							height: 'auto',
							overflow: 'visible',
							transition: {
								height: { duration: 0.2 },
								opacity: { duration: 0.3, delay: 0.2 },
							}
						}}
						exit={{
							opacity: 0,
							height: 0,
							overflow: 'hidden',
							transition: {
								opacity: { duration: 0.2 },
								height: { duration: 0.3, delay: 0.2 },
							}
						}}
						transition={{
							duration: 0.3,
							ease: 'easeInOut',
						}}
						className="flex flex-col md:flex-row gap-2 items-center w-full mt-2"
					>
						{filters.keyword && (
							<Input
								theme={theme}
								name={"keyword"}
								value={keyword}
								onChange={e => setKeyword(e.target.value)}
								placeholder={filters.keyword.placeholder ?? '검색어 입력'}
								className="px-2 py-1 rounded w-full md:w-1/2"
							/>
						)}

						{filters.status && (
							<Select
								value={filters.status.value}
								onChange={filters.status.onChange}
								options={filters.status.options}
								placeholder="선택"
								className="w-full md:w-1/6"
							/>
						)}

						{filters.dateRange && (
							<div className="relative w-full md:min-w-[300px] md:w-1/4">
								<button
									type={"button"}
									onClick={() => setShowDatePicker(!showDatePicker)}
									className={clsx(
										styles["date-picker-label"],
										styles[theme],
										"px-2 py-1 rounded w-full text-left cursor-pointer"
									)}
								>
									{tempFrom && tempTo ? `${tempFrom} ~ ${tempTo}` : '기간'}
								</button>

								<AnimatePresence>
									{showDatePicker && (
										<motion.div
											variants={fadeSlideDownSm}
											initial="enter"
											animate="center"
											exit="exit"
											transition={{duration: 0.3}}
											className="absolute z-10 mt-1 w-full text-sm"
										>
											<DatePicker
												initialFrom={tempFrom ? dayjs(tempFrom) : undefined}
												initialTo={tempTo ? dayjs(tempTo) : undefined}
												onChange={(from, to) => {
													const f = from.format('YYYY-MM-DD');
													const t = to.format('YYYY-MM-DD');
													setTempFrom(f);
													setTempTo(t);
													filters.dateRange!.onChange(f, t);
													setShowDatePicker(false);
												}}
											/>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}

						<div className="flex gap-2 w-full md:w-1/8">
							<Button
								width="w-full"
								padding="py-1 md:py-0.5"
								theme="dark"
								onClick={handleReset}
								reverse={theme === "normal"}
								light={theme !== "normal"}
								className={"self-end"}
							>리셋</Button>
							{/*<Button
								width="w-1/2"
								padding="py-1"
								theme="dark"
								reverse={theme === "normal"}
								light={theme !== "normal"}
							>적용</Button>*/}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>

	);
};

export default SearchBar;