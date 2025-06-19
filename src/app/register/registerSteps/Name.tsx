'use client'

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";
import Input from "@/components/base/Input";
import AnimatedText from "@/components/base/AnimatedText";
import clsx from "clsx";
import { isValidName } from "@/components/utils/validators";

interface NameProps {
	key: string,
	value: string,
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	isValid: boolean,
	onValidChange: (isValid: boolean) => void,
	theme?: Theme,
}

const Name = ({
	value,
	onChange,
	isValid,
	onValidChange,
	theme
}: NameProps) => {
	const [touched, setTouched] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		// 숫자 제거
		const filtered = input.replace(/\d/g, '');

		if (!touched) setTouched(true);

		onChange({
			...e,
			target: {
				...e.target,
				value: filtered,
			},
		});
	};

	// 유효성 검사
	useEffect(() => {
		const valid = isValidName(value);
		onValidChange?.(valid);
	}, [value, onValidChange]);

	return (
		<div className="flex flex-col relative overflow-hidden">
			<div className={"mb-2"}>
				<AnimatedText fontSize={"text-base md:text-xl"} text={"이름이 어떻게 되시나요? 😊"}/>
			</div>
			<div className={"mb-4"}>
				<AnimatedText fontSize={"text-sm md:text-base"} text={"💡 별명도 좋지만 되도록이면 이름을 입력해 주세요!"} delay={0.8}/>
			</div>

			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				exit="exit"
			>
				<Input
					type={"text"}
					name={"name"}
					placeholder={"이름을 입력해주세요."}
					theme={theme}
					className={"font text-md md:text-lg"}
					value={value}
					onChange={handleChange}
				/>
			</motion.div>

			<div
				className={clsx(
					"text-right text-sm min-h-[20px] mt-1 transition-all duration-300 ease-in-out",
					theme === "normal" ? "text-red-600" : "text-red-300",
					!touched || isValid ? "opacity-0 translate-y-[-4px]" : "opacity-100 translate-y-0"
				)}
			>
				{touched && !isValid && "한글 또는 영어 이름을 2자 이상 입력해주세요."}
			</div>
		</div>
	);
};

export default Name;