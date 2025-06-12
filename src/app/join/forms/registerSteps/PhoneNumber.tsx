import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";
import { isValidPhoneNumber } from "@/components/utils/validators";
import { ThumbUpIcon } from "@/components/icon/ThumbUpIcon";
import Input from "@/components/base/Input";
import AnimatedText from "@/components/base/AnimatedText";
import clsx from "clsx";
import Button from "@/components/base/Button";
import useToast from "@/hooks/useToast";

interface PhoneNumberProps {
	key: string;
	value: string,
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	isValid: boolean,
	onValidChange: (isValid: boolean) => void,
	isDuplicatePhone: boolean | null;
	onDuplicateCheck: (isDuplicatePhone: boolean) => void;
	theme?: Theme,
}

const PhoneNumber = ({
	value,
	onChange,
	isValid,
	onValidChange,
	isDuplicatePhone,
	onDuplicateCheck,
	theme
}: PhoneNumberProps,) => {
	const { showToast } = useToast();
	const [touched, setTouched] = useState(false);
	const [checking, setChecking] = useState(false);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		// 숫자, -, 공백만 허용하고 나머지는 제거
		const filtered = input.replace(/[^0-9-\s]/g, '');

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
		const valid = isValidPhoneNumber(value);
		onValidChange?.(valid);
		onDuplicateCheck?.(null);
	}, [value, onValidChange, onDuplicateCheck]);

	const checkDuplicatePhone = async () => {
		if (value === "") {
			showToast({
				message: "핸드폰 번호를 입력해주세요.",
				autoCloseTime: 3000,
				iconType: "warning",
			});
			return;
		}
		if (!isValid) {
			showToast({
				message: "올바른 핸드폰 번호을 입력해주세요.",
				autoCloseTime: 3000,
				iconType: "warning",
			});
			return;
		}

		setChecking(true);
		const digits = value.replace(/[^0-9]/g, '');
		console.log(digits);
		const { data, error } = await supabase.rpc('check_phone_duplicate', { input_phone_number: digits });
		console.log(data);

		setChecking(false);

		if (error) {
			console.error("핸드폰 번호 중복 체크 실패:", error.message);
			showToast({
				message: "핸드폰 번호 중복 확인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
				autoCloseTime: 3000,
				iconType: "error",
			});
			onDuplicateCheck?.(null);
			onValidChange?.(false);
			return;
		}

		const isUsed = data;
		onDuplicateCheck?.(isUsed);

		showToast({
			message: isUsed
				? "이미 사용 중인 핸드폰 번호에요."
				: "사용 가능한 핸드폰 번호에요!",
			autoCloseTime: 3000,
			iconType: isUsed ? "warning" : "success",
		});
	}

	return (
		<div className="flex flex-col relative overflow-hidden">
			<div className={"mb-2"}>
				<AnimatedText fontSize={"text-base md:text-xl"} text={"핸드폰 번호를 입력해주세요! 📱"}/>
			</div>
			<div className={"mb-4"}>
				<AnimatedText fontSize={"text-sm md:text-base"} text={"💡 숫자만 입력해도 괜찮아요!"} delay={0.8}/>
			</div>

			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				exit="exit"
				className={"flex gap-2"}
			>
				<Input
					type={"tel"}
					name={"phoneNumber"}
					placeholder={"핸드폰 번호를 입력해주세요."}
					theme={theme}
					className={"font text-md md:text-xl"}
					value={value}
					onChange={handleChange}
				/>
				<Button
					theme={"dark"}
					width={"20%"}
					fontSize={"text-sm md:text-base"}
					padding={"px-2 py-1.5"}
					onClick={checkDuplicatePhone}
					disabled={checking || isDuplicatePhone === false}
				>
					{checking ? (
						<div className="animate-spin w-5 h-5 border-t-2 border-white rounded-full mx-auto" />
					) : isDuplicatePhone === false ? (
						<div className="flex items-center justify-center">
							<ThumbUpIcon />
						</div>
					) : (
						"확인"
					)}
				</Button>
			</motion.div>

			<div
				className={clsx(
					"text-right text-sm min-h-[20px] mt-1 transition-all duration-300 ease-in-out",
					theme === "normal" ? "text-red-600" : "text-red-300",
					!touched || isValid ? "opacity-0 translate-y-[-4px]" : "opacity-100 translate-y-0"
				)}
			>
				{touched && !isValid && "유효한 핸드폰 번호를 입력해주세요."}
			</div>
		</div>
	)
};

export default PhoneNumber;
