import { Theme } from "@/types/ui/theme";
import clsx from "clsx";
import styles from "@/css/module/progress-bar.module.css";
import { WritingIcon } from "@/components/icon/WritingIcon";
import { FlagIcon } from "@/components/icon/FlagIcon";

interface ProgressBarProps {
	steps: string[];
	currentStep: number;
	theme: Theme;
	className?: string;
}

const ProgressBar = ({ steps, currentStep, theme, className }: ProgressBarProps) => {
	const percentage = Math.max(0, Math.min((currentStep / (steps.length - 1)) * 100, 100));
	const isLastStep = currentStep === steps.length - 1;
	const DisplayIcon = isLastStep ? FlagIcon : WritingIcon;

	return (
		<div className="flex items-center gap-2">
			<div
				className={clsx(
					styles.progressWrapper,
					theme && styles[theme],
					className
			)}>
				<div
					className={clsx(
						styles.progressInner,
						theme && styles[theme]
					)}
					style={{ width: `${percentage}%` }}
				/>
			</div>
			<div className="flex flex-col items-center shrink-0 whitespace-nowrap">
				<DisplayIcon />
				<div className="text-xs md:text-sm">
					{currentStep + 1} / {steps.length}
				</div>
			</div>
		</div>
	);
};

export default ProgressBar;