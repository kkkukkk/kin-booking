'use client'

import React, { useEffect, useState } from "react";
import { motion} from "framer-motion";
import { fadeSlideDown, fadeSlideLeft } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";
import Input from "@/components/base/Input";
import useDebounce from "@/hooks/useDebounce";

interface NameProps {
	value?: string,
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
	theme?: Theme,
	onValidChange?: (isValid: boolean) => void,
}

const Name = ({
	value = '',
	onChange,
	theme,
	onValidChange
}: NameProps) => {
	const debouncedName = useDebounce<string>(value, 300);
	const [isValid, setIsValid] = useState(false);

	// 초기
	useEffect(() => {
		const immediateValid = value.trim().length >= 2;
		setIsValid(immediateValid);
		onValidChange?.(immediateValid);
	}, [value, onValidChange]);

	useEffect(() => {
		const valid = debouncedName.trim().length >= 2;
		setIsValid(valid);
		onValidChange?.(valid);
	}, [debouncedName, onValidChange]);

	return (
		<div className="flex flex-col gap-4">
			<motion.div
				variants={fadeSlideDown}
				initial="hidden"
				animate="visible"
				className="text-base md:text-xl"
			>
				이름이 어떻게 되시나요?
			</motion.div>

			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
			>
				<Input
					type={"text"}
					placeholder={"이름을 입력해주세요."}
					theme={theme}
					className={"font text-xl"}
					variant={"underline"}
					value={value}
					onChange={onChange}
				/>
			</motion.div>

			<div
				className={"text-right text-sm text-red-500 h-[20px]"}
			>
				{!isValid && "이름을 2자 이상 입력해주세요."}
			</div>
		</div>
	);
}

export default Name;