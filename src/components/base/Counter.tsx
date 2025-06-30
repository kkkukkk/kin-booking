'use client'

import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

interface CounterProps {
	value: number;
	min?: number;
	max: number;
	onChange: (value: number) => void;
}

const Counter = ({ value, min = 1, max, onChange }: CounterProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	
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
				return 'border-gray-600 text-gray-600 hover:border-gray-800 hover:text-gray-800 hover:scale-105 active:scale-95';
			case 'dark':
				return 'border-gray-400 text-gray-400 hover:border-gray-200 hover:text-gray-200 hover:scale-105 active:scale-95';
			case 'neon':
				return 'border-cyan-400 text-cyan-400 hover:border-cyan-300 hover:text-cyan-300 hover:scale-105 active:scale-95';
			default:
				return 'border-gray-600 text-gray-600 hover:border-gray-800 hover:text-gray-800 hover:scale-105 active:scale-95';
		}
	};

	const getValueClasses = () => {
		switch (theme) {
			case 'normal':
				return 'text-gray-900';
			case 'dark':
				return 'text-gray-100';
			case 'neon':
				return 'text-cyan-100';
			default:
				return 'text-gray-900';
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
				<span className={`text-lg font-semibold ${getValueClasses()}`}>
					{value}
				</span>
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