import React from "react";
import Input from "@/components/base/Input";
import { motion } from "framer-motion";
import { fadeSlideDown, fadeSlideLeft, fadeSlideUp } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";

interface PasswordProps {
	value?: string,
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
	theme?: Theme,
	onValidChange?: (isValid: boolean) => void,
}

const Password = ({ value, onChange, theme, onValidChange }: PasswordProps) => {
	return (
		<div className="flex flex-col gap-4">
			<motion.div
				variants={fadeSlideDown}
				initial="hidden"
				animate="visible"
				className="text-base md:text-xl"
			>
				{"비밀번호를 입력해주세요."}
			</motion.div>

			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
			>
				<Input
					type={"text"}
					placeholder={"비밀번호"}
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
				{"비밀번호는 특수문자를 포함해 8자 이상 작성해주세요."}
			</motion.div>
		</div>
	)
}

export default Password;