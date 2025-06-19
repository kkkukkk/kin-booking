'use client'

import React, { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";
import { ThumbUpIcon } from "@/components/icon/ThumbUpIcon";
import { isValidEmail } from "@/components/utils/validators";
import Input from "@/components/base/Input";
import AnimatedText from "@/components/base/AnimatedText";
import clsx from "clsx";
import Button from "@/components/base/Button";
import useToast from "@/hooks/useToast";

interface EmailProps {
	key: string;
	value: string,
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	isValid: boolean;
	onValidChange: (isValid: boolean) => void;
	isDuplicateEmail: boolean | null;
	onDuplicateCheck: (isDuplicateEmail: boolean | null) => void;
	theme?: Theme,
}

const Email = ({
	value,
	onChange,
	isValid,
	onValidChange,
	isDuplicateEmail,
	onDuplicateCheck,
	theme,
}: EmailProps,) => {
	const { showToast } = useToast();
	const [touched, setTouched] = useState(false);
	const [checking, setChecking] = useState(false);

	const prevValueRef = useRef<string>(value);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!touched) setTouched(true);
		onChange(e);
	};

	// 유효성 검사
	useEffect(() => {
		const valid = isValidEmail(value);
		onValidChange?.(valid);
		if (prevValueRef.current !== value) {
			onDuplicateCheck?.(null);
			prevValueRef.current = value;
		}
	}, [value, onValidChange, onDuplicateCheck]);

	// 이메일 중복검사 함수
	const checkDuplicateEmail = async () => {
		if (value === "") {
			showToast({
				message: "이메일을 입력해주세요.",
				autoCloseTime: 3000,
				iconType: "warning",
			});
			return;
		}

		if (!isValid) {
			showToast({
				message: "올바른 이메일을 입력해주세요.",
				autoCloseTime: 3000,
				iconType: "warning",
			});
			return;
		}

		setChecking(true);

		// Supabase 이메일 중복 여부 체크
		// Authentication 저장 시 users 테이블에도 저장되므로 users 테이블에서 조회하는 함수 (rls 권한 때문)
		// 사용중 true, 미사용 false
		const { data, error } = await supabase.rpc("check_email_duplicate", {
			input_email: value,
		});

		setChecking(false);

		if (error) {
			console.error("이메일 중복 체크 실패:", error.message);
			showToast({
				message: "이메일 중복 확인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
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
				? "이미 사용 중인 이메일이에요."
				: "사용 가능한 이메일이에요!",
			autoCloseTime: 3000,
			iconType: isUsed ? "warning" : "success",
		});
	};

	return (
		<div className="flex flex-col relative overflow-hidden">
			<div className={"mb-2"}>
				<AnimatedText fontSize={"text-base md:text-xl"} text={"사용할 이메일을 입력해주세요! 📧"}/>
			</div>
			<div className={"mb-4"}>
				<AnimatedText fontSize={"text-sm md:text-base"} text={"💡 입력한 이메일은 로그인에 사용돼요."} delay={0.8}/>
			</div>

			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				exit="exit"
				className={"flex gap-2"}
			>
				<Input
					type={"email"}
					name={"email"}
					placeholder={"이메일을 입력해주세요."}
					theme={theme}
					className={"font text-base md:text-lg"}
					value={value}
					onChange={handleChange}
				/>
				<Button
					theme={"dark"}
					width={"w-1/5"}
					fontSize={"text-sm md:text-base"}
					padding={"px-2 py-1.5"}
					onClick={checkDuplicateEmail}
					disabled={checking || isDuplicateEmail === false}
				>
					{checking ? (
						<div className="animate-spin w-5 h-5 border-t-2 border-white rounded-full mx-auto" />
					) : isDuplicateEmail === false ? (
						<div className="flex items-center justify-center">
							<ThumbUpIcon />
						</div>
					) : (
						"확인"
					)}
				</Button>
			</motion.div>

			<div className={clsx(
				!touched || isValid ? "opacity-0 translate-y-[-4px]" : "opacity-100 translate-y-0",
				"text-right text-sm min-h-[20px] mt-1",
				"transition-all duration-300 ease-in-out",
				theme === "normal" ? "text-red-600" : "text-red-300"
			)}>
				<div>
					{"이메일 형식에 맞춰 입력해주세요."}
				</div>
				<div className="text-xs">
					{"ex) example@sample.com"}
				</div>
			</div>
		</div>
	);
};

export default Email;