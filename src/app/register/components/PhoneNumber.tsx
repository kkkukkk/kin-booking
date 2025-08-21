'use client'

import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";
import { isValidPhoneNumber } from "@/util/validators";
import { ThumbUpIcon } from "@/components/icon/ThumbUpIcon";
import Input from "@/components/base/Input";
import clsx from "clsx";
import Button from "@/components/base/Button";
import useToast from "@/hooks/useToast";
import AnimatedTextWithIcon from "@/components/base/AnimatedTextWithIcon";
import { PhoneIcon } from "@/components/icon/PhoneIcon";
import { BulbIcon } from "@/components/icon/BulbIcon";

interface PhoneNumberProps {
	key: string;
	value: string,
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	isValid: boolean,
	onValidChange: (isValid: boolean) => void,
	isDuplicatePhone: boolean | null;
	onDuplicateCheck: (isDuplicatePhone: boolean | null) => void;
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

	const prevValueRef = useRef<string>(value);

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
		if (prevValueRef.current !== value) {
			onDuplicateCheck?.(null);
			prevValueRef.current = value;
		}
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
		const { data, error } = await supabase.rpc('check_phone_duplicate', { input_phone_number: digits });

		setChecking(false);

		if (error) {
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
				? "이미 사용 중인 휴대폰 번호에요."
				: "사용 가능한 휴대폰 번호에요!",
			autoCloseTime: 3000,
			iconType: isUsed ? "warning" : "success",
		});
	}

	return (
		<div className="flex flex-col relative overflow-hidden">
			{/* 제목과 안내 문구를 컨테이너로 감싸기 */}
			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				className="p-2 rounded mt-3 mb-6 backdrop-blur-sm bg-white/10 border border-white/10 shadow-lg"
			>
				<div className="mb-3">
					<AnimatedTextWithIcon fontSize={"text-base"} text={"핸드폰 번호를 입력해주세요!"} leftIcon={<PhoneIcon />} />
				</div>
				<div className="text-sm text-gray-600">
					<AnimatedTextWithIcon fontSize={"text-sm"} text={"숫자만 입력해도 괜찮아요!"} delay={0.8} leftIcon={<BulbIcon />} />
				</div>
			</motion.div>

			{/* 입력 필드와 버튼 */}
			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				exit="exit"
				className="flex flex-col items-center space-y-4"
			>
				<div className="flex items-center space-x-3 w-full">
					<Input
						type={"tel"}
						name={"phoneNumber"}
						placeholder={"핸드폰 번호를 입력해주세요."}
						theme={theme}
						className={"font text-md md:text-lg flex-1"}
						value={value}
						onChange={handleChange}
						maxLength={13}
					/>
					<Button
						theme={"dark"}
						width={"w-24"}
						fontSize={"text-sm"}
						padding={"py-1.5"}
						onClick={checkDuplicatePhone}
						reverse={theme === "normal"}
						light={theme !== "normal"}
						disabled={checking || isDuplicatePhone === false}
						className="font-semibold"
					>
						{checking ? (
							<div className="animate-spin w-4 h-4 border-t-2 border-white rounded-full mx-auto" />
						) : isDuplicatePhone === false ? (
							<div className="flex items-center justify-center">
								<ThumbUpIcon />
							</div>
						) : (
							"중복확인"
						)}
					</Button>
				</div>
			</motion.div>

			{/* 에러 메시지 */}
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
