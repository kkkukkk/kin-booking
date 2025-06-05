import { CheckBoxWithLabelProps } from "@/types/ui/checkbox";

const CheckBoxWithLabel = ({
	theme,
	checked,
	onChange,
	label,
	required
}: CheckBoxWithLabelProps) => {
	return (
		<label className="inline-flex items-center cursor-pointer select-none">
			<input
				type={"checkbox"}
				className={"sr-only"}
				checked={checked}
				onChange={(e) => onChange?.(e.target.checked)}
				required={required}
			/>
			<span
				className={
					`w-5 h-5 mr-2 flex items-center justify-center border-2 rounded-md
	                ${checked ? 'bg-[var(--check-box)] border-[var(--check-box)]' : 'border-gray-400'}
	                transition-colors`
				}
			>
				{checked && (
					<svg
						className="w-4 h-4 text-white"
						fill="none"
						stroke="currentColor"
						strokeWidth="3"
						viewBox="0 0 24 24"
					>
						<path d="M5 13l4 4L19 7"/>
					</svg>
				)}
			</span>
			<span>{label}{required && <span className={"text-red-500 ml-1"}>*</span>}</span>
		</label>
	)
}

export default CheckBoxWithLabel;