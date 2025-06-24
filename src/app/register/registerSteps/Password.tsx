'use client'

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";
import { isValidPassword } from "@/components/utils/validators";
import clsx from "clsx";
import InputWithPasswordToggle from "@/components/base/InputWithPasswordToggle";
import AnimatedTextWithIcon from "@/components/base/AnimatedTextWithIcon";
import { KeyIcon } from "@/components/icon/KeyIcon";
import { BulbIcon } from "@/components/icon/BulbIcon";

interface PasswordProps {
	key: string;
	value: string,
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	isValid: boolean,
	onValidChange: (isValid: boolean, reason?: "invalidFormat" | "notMatch" | null) => void;
	theme?: Theme,
}

const Password = ({
	value,
	onChange,
	isValid,
	onValidChange,
	theme
}: PasswordProps) => {
	const [confirmPassword, setConfirmPassword] = useState("");
	const [touched, setTouched] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!touched) setTouched(true);
		onChange(e);
	};

	const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!touched) setTouched(true);
		setConfirmPassword(e.target.value);
	};

	// 유효성 검사
	useEffect(() => {
		const passwordValid = isValidPassword(value);
		const match = value === confirmPassword;

		let reason: "invalidFormat" | "notMatch" | null = null;

		if (!passwordValid) {
			reason = "invalidFormat";
		} else if (!match) {
			reason = "notMatch";
		}

		const finalValid = passwordValid && match;
		onValidChange?.(finalValid, reason);
	}, [value, confirmPassword, onValidChange]);

	return (
		<div className="flex flex-col relative overflow-hidden">
			<div className={"mb-2"}>
				<AnimatedTextWithIcon fontSize={"text-base md:text-xl"} text={"사용할 비밀번호를 입력해주세요!"} rightIcon={<KeyIcon />} />
			</div>
			<div className={"mb-4"}>
				<AnimatedTextWithIcon fontSize={"text-sm md:text-base"} text={"비밀번호는 특수문자를 포함해 8자 이상 작성해주세요!"} delay={0.8} leftIcon={<BulbIcon />} />
			</div>

			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				className={"flex flex-col gap-2"}
			>
				<InputWithPasswordToggle
					type={"password"}
					name={"password"}
					placeholder={"비밀번호를 입력해주세요."}
					theme={theme}
					className={"font text-md md:text-lg"}
					value={value}
					onChange={handleChange}
				/>
				<InputWithPasswordToggle
					type={"password"}
					name={"confirmPassword"}
					placeholder={"동일한 비밀번호를 입력해주세요."}
					theme={theme}
					className={"font text-md md:text-lg"}
					value={confirmPassword}
					onChange={handleConfirmChange}
				/>
			</motion.div>


			<div
				className={clsx(
					"text-right text-sm min-h-[20px] mt-1 transition-all duration-300 ease-in-out",
					theme === "normal" ? "text-red-600" : "text-red-300",
					!touched || isValid ? "opacity-0 translate-y-[-4px]" : "opacity-100 translate-y-0"
				)}
			>
				{touched && !isValid && (
					<>
						{!isValidPassword(value)
							? "비밀번호는 특수문자를 포함해 8자 이상 입력해주세요."
							: "비밀번호가 서로 일치하지 않아요."}
					</>
				)}
			</div>
		</div>
	)
};

export default Password;