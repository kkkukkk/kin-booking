import React from "react";
import { motion } from "framer-motion";
import { fadeSlideDown, fadeSlideLeft, fadeSlideUp } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";
import Input from "@/components/base/Input";

interface EmailProps {
	value?: string,
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
	theme?: Theme,
	onValidChange?: (isValid: boolean) => void,
}

const Email = ({ value, onChange, theme, onValidChange }: EmailProps) => {
	return (
		<div className="flex flex-col gap-4">
			<motion.div
				variants={fadeSlideDown}
				initial="hidden"
				animate="visible"
				className="text-base md:text-xl"
			>
				{"사용할 이메일을 입력해주세요."}
			</motion.div>

			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
			>
				<Input
					type={"text"}
					placeholder={"이메일"}
					theme={theme}
					className={
						"font text-xl"
					}
					variant={"underline"}
				/>
			</motion.div>
			<motion.div
				variants={fadeSlideUp}
				initial="hidden"
				animate="visible"
			>
				{"사용할 수 없는 이메일입니다."}
			</motion.div>
		</div>

	)
}

export default Email;