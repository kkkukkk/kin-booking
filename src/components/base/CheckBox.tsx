import { CheckBoxProps } from "@/types/ui/checkbox";

const CheckBox = ({ checked, onChange, required }: CheckBoxProps) => {

	return (
		<label className="inline-flex items-center cursor-pointer select-none">
			<input
				type="checkbox"
				className="sr-only"
				checked={checked}
				onChange={(e) => onChange?.(e.target.checked)}
				required={required}
			/>
			<span
				className={`w-5 h-5 flex items-center justify-center border-2 rounded-md
                ${checked ? "bg-blue-600 border-blue-600" : "border-gray-400"}
                transition-colors`}
			>
        {checked && (
	        <svg
		        className="w-4 h-4 text-white"
		        fill="none"
		        stroke="currentColor"
		        strokeWidth="3"
		        viewBox="0 0 24 24"
	        >
		        <path d="M5 13l4 4L19 7" />
	        </svg>
        )}
      </span>
		</label>
	);
};

export default CheckBox;