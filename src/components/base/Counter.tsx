interface CounterProps {
	value: number;
	min?: number;
	max: number;
	onChange: (value: number) => void;
}

const Counter = ({ value, min = 1, max, onChange }: CounterProps) => {
	return (
		<div className="flex items-center gap-4">
			<button onClick={() => onChange(Math.max(min, value - 1))}>-</button>
			<span>{value}</span>
			<button onClick={() => onChange(Math.min(max, value + 1))}>+</button>
		</div>
	);
};

export default Counter;