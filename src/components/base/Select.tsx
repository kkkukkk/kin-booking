'use client';

import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import clsx from "clsx";
import { CheckIcon } from "@/components/icon/CheckIcon";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeSlideDownSm } from "@/types/ui/motionVariants";

interface CustomSelectProps {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder?: string;
	className?: string;
}

const CustomSelect = ({
	value,
	onChange,
	options,
	placeholder = "선택",
	className = "",
}: CustomSelectProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const selectedLabel = options.find(opt => opt.value === value)?.label ?? placeholder;

	const [isOpen, setIsOpen] = useState(false);
	const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

	const buttonRef = useRef<HTMLButtonElement>(null);
	const dropdownRef = useRef<HTMLUListElement>(null);

	const handleToggle = () => {
		if (!buttonRef.current) return;

		const rect = buttonRef.current.getBoundingClientRect();
		setPosition({
			top: rect.bottom + window.scrollY,
			left: rect.left + window.scrollX,
			width: rect.width,
		});
		setIsOpen(prev => !prev);
	};

	const handleSelect = (val: string) => {
		onChange(val);
		setIsOpen(false);
	};

	// 외부 클릭 시 닫기
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				buttonRef.current?.contains(target) ||
				dropdownRef.current?.contains(target)
			) {
				return;
			}
			setIsOpen(false);
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	// 테마별 스타일
	const getThemeStyles = () => {
		switch (theme) {
			case "normal":
				return "text-black bg-white border border-black/20";
			case "dark":
				return "text-gray-200 bg-black/90 border border-white/50";
			case "neon":
				return "text-gray-200 bg-black/90 border border-white/50";
			default:
				return "text-black bg-white border border-black/20";
		}
	};

	// 리스트 아이템 테마별 스타일
	const getListItemThemeStyles = () => {
		switch (theme) {
			case "normal":
				return "border-b border-black/10 hover:bg-black/10";
			case "dark":
				return "border-b border-white/10 hover:bg-white/10";
			case "neon":
				return "border-b border-white/10 hover:bg-white/10";
			default:
				return "border-b border-black/10 hover:bg-black/10";
		}
	};

	return (
		<>
			<div className={clsx("relative w-full", className)}>
				<button
					ref={buttonRef}
					type="button"
					onClick={handleToggle}
					className={clsx(
						"w-full px-2 py-1 rounded flex justify-between items-center shadow-[1px_1px_0_1px_rgba(0,0,0,0.1)]",
						getThemeStyles()
					)}
				>
					<span>{selectedLabel}</span>
					<span className={clsx("text-xs text-gray-600", isOpen && "rotate-180")}>▾</span>
				</button>
			</div>

			{isOpen && typeof window !== "undefined" && createPortal(
				<AnimatePresence>
					<motion.ul
						ref={dropdownRef}
						variants={fadeSlideDownSm}
						initial="enter"
						animate="center"
						exit="exit"
						transition={{ duration: 0.2 }}
						className={clsx(
							"fixed z-[9999] rounded max-h-60 overflow-y-auto",
							getThemeStyles()
						)}
						style={{
							top: position.top,
							left: position.left,
							width: position.width,
						}}
					>
						{options.map((opt, index) => (
							<li
								key={opt.value}
								onClick={() => handleSelect(opt.value)}
								className={clsx(
									"px-2 py-1.5 cursor-pointer flex justify-between items-center opacity-80 hover:opacity-100 focus:opacity-100",
									getListItemThemeStyles(),
									index === options.length - 1 && "border-b-0"
								)}
							>
								{opt.label}
								{opt.value === value && <CheckIcon />}
							</li>
						))}
					</motion.ul>
				</AnimatePresence>,
				document.body
			)}
		</>
	);
};

export default CustomSelect;