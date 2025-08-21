'use client'

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';
import { useState, useRef, useEffect } from 'react';

interface CounterProps {
	value: number;
	min?: number;
	max: number;
	onChange: (value: number) => void;
}

const Counter = ({ value, min = 1, max, onChange }: CounterProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [inputValue, setInputValue] = useState(value.toString());
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	
	// value가 외부에서 변경될 때 inputValue 동기화
	useEffect(() => {
		setInputValue(value.toString());
	}, [value]);

	const handleDecrease = () => {
		if (value > min) {
			onChange(value - 1);
		}
	};

	const handleIncrease = () => {
		if (value < max) {
			onChange(value + 1);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);
		
		// 숫자가 아닌 문자 제거
		if (/^\d*$/.test(newValue)) {
			const numValue = parseInt(newValue);
			if (!isNaN(numValue)) {
				// min과 max 범위 내로 조정
				let adjustedValue = numValue;
				if (numValue < min) {
					adjustedValue = min;
				} else if (numValue > max) {
					adjustedValue = max;
				}
				
				// 조정된 값으로 onChange 호출
				onChange(adjustedValue);
			}
		}
	};

	const handleInputBlur = () => {
		setIsEditing(false);
		const numValue = parseInt(inputValue);
		
		// 유효하지 않은 값이면 원래 값으로 복원
		if (isNaN(numValue) || numValue < min || numValue > max) {
			setInputValue(value.toString());
		}
	};

	const handleInputFocus = () => {
		setIsEditing(true);
		inputRef.current?.select();
	};

	const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			inputRef.current?.blur();
		}
	};

	const getButtonClasses = (isDisabled: boolean) => {
		if (isDisabled) {
			switch (theme) {
				case 'normal':
					return 'border-gray-300 text-gray-300 cursor-not-allowed';
				case 'dark':
					return 'border-gray-600 text-gray-600 cursor-not-allowed';
				case 'neon':
					return 'border-gray-600 text-gray-600 cursor-not-allowed';
				default:
					return 'border-gray-300 text-gray-300 cursor-not-allowed';
			}
		}
		
		switch (theme) {
			case 'normal':
				return 'border-gray-600 text-gray-600 hover:border-gray-800 hover:text-gray-800';
			case 'dark':
				return 'border-gray-400 text-gray-400 hover:border-gray-200 hover:text-gray-200';
			case 'neon':
				return 'border-cyan-400 text-cyan-400 hover:border-cyan-300 hover:text-cyan-300';
			default:
				return 'border-gray-600 text-gray-600 hover:border-gray-800 hover:text-gray-800';
		}
	};

	const getInputClasses = () => {
		switch (theme) {
			case 'normal':
				return 'text-gray-900 bg-white border-gray-300 focus:border-green-500';
			case 'dark':
				return 'text-gray-100 bg-gray-700 border-gray-600 focus:border-green-400';
			case 'neon':
				return 'text-cyan-100 bg-gray-800 border-cyan-400 focus:border-green-400';
			default:
				return 'text-gray-900 bg-white border-gray-300 focus:border-green-500';
		}
	};

	return (
		<div className="flex items-center gap-3">
			<button
				onClick={handleDecrease}
				disabled={value <= min}
				className={`
					w-8 h-8 rounded-full border-2 flex items-center justify-center
					transition-all duration-200 font-semibold text-lg
					transform-gpu origin-center
					${getButtonClasses(value <= min)}
				`}
			>
				<span className="w-3 h-3 flex items-center justify-center">-</span>
			</button>
			
			<div className="min-w-[3rem] text-center">
				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onBlur={handleInputBlur}
					onFocus={handleInputFocus}
					onKeyPress={handleKeyPress}
					max={max}
					className={`
						w-12 h-8 text-center text-lg font-semibold rounded border-2
						focus:outline-none focus:border-green-500
						transition-all duration-200
						${getInputClasses()}
					`}
				/>
			</div>
			
			<button
				onClick={handleIncrease}
				disabled={value >= max}
				className={`
					w-8 h-8 rounded-full border-2 flex items-center justify-center
					transition-all duration-200 font-semibold text-lg
					transform-gpu origin-center
					${getButtonClasses(value >= max)}
				`}
			>
				<span className="w-3 h-3 flex items-center justify-center">+</span>
			</button>
		</div>
	);
};

export default Counter;