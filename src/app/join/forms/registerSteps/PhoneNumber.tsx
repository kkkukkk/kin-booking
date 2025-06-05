import React from "react";
import Input from "@/components/base/Input";
import { motion } from "framer-motion";
import { fadeSlideDown, fadeSlideLeft, fadeSlideUp } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";

interface PhoneNumberProps {
	value?: string,
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
	theme?: Theme,
	onValidChange?: (isValid: boolean) => void,
}

const PhoneNumber = ({ value, onChange, theme, onValidChange }: PhoneNumberProps) => {

	return (
		<div className="flex flex-col gap-4">
			<motion.div
				variants={fadeSlideDown}
				initial="hidden"
				animate="visible"
				className="text-base md:text-xl"
			>
				{"전화번호를 입력해주세요."}
			</motion.div>

			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
			>
				<Input
					type={"text"}
					placeholder={"전화번호"}
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
				{"유효한 전화번호를 입력해주세요."}
			</motion.div>
		</div>
	)
}

export default PhoneNumber;
