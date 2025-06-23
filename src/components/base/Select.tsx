'use client';
import { useState } from "react";
import {useAppSelector} from "@/redux/hooks";
import {RootState} from "@/redux/store";
import clsx from "clsx";
import styles from "@/css/module/select.module.css";
import {CheckIcon} from "@/components/icon/CheckIcon";

interface CustomSelectProps {
	value: string;
	onChange: (value: string) => void;
	options: { value: string; label: string }[];
	placeholder?: string;
	className?: string;
}

const CustomSelect = ({ value, onChange, options, placeholder = "선택", className = "" }: CustomSelectProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [isOpen, setIsOpen] = useState(false);
	const selected = options.find(opt => opt.value === value)?.label || placeholder;

	const handleSelect = (val: string) => {
		onChange(val);
		setIsOpen(false);
	};


	return (
		<div className={`relative w-full ${className}`}>
			<button
				type="button"
				onClick={() => setIsOpen(prev => !prev)}
				className={clsx(
					"w-full px-2 py-1 rounded flex justify-between items-center",
					styles["selectButton"],
					styles[theme]
				)}
			>
				<span>{selected}</span>
				<span
					className={clsx(
						"text-xs text-gray-600",
						isOpen && "rotate-180"
					)}
				>▾</span>
			</button>

			{isOpen && (
				<ul className={clsx(
					"absolute mt-1 w-full rounded z-10 max-h-60 overflow-y-auto",
					styles["selectUl"],
					styles[theme]
				)}>
					{options.map(opt => (
						<li
							key={opt.value}
							onClick={() => handleSelect(opt.value)}
							className={clsx(
								"px-2 py-1.5 cursor-pointer flex justify-between items-center",
								styles["selectLi"],
								styles[theme]
							)}
						>
							{opt.label}
							{opt.value === value && <CheckIcon />}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default CustomSelect;