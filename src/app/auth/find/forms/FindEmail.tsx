import ThemeDiv from "@/components/base/ThemeDiv";
import { motion } from "framer-motion";
import { fadeSlideLeft, tabs } from "@/types/ui/motionVariants";
import AnimatedText from "@/components/base/AnimatedText";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { supabase } from "@/lib/supabaseClient";
import useToast from "@/hooks/useToast";

const FindEmail = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [checking, setChecking] = useState(false);
	const { showToast } = useToast();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		// 숫자, -, 공백만 허용하고 나머지는 제거
		const filtered = input.replace(/[^0-9-\s]/g, '');

		setPhoneNumber(filtered);
	}

	const handleFindEmail = async () => {
		const digits = phoneNumber.replace(/[^0-9]/g, '');

		const { data, error } = await supabase.rpc("find_user_email_by_phone", {
			input_phone_number: digits,
		});

		if (error) {
			console.error("휴대폰 번호 중복 체크 실패:", error.message);
			showToast({
				message: "확인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
				autoCloseTime: 3000,
				iconType: "error",
			});
			return;
		} else {
			if (data) {
				showToast({
					message: `찾기 성공!`,
					iconType: "success",
				})
			}
		}

	}

	return (
		<ThemeDiv
			className={"p-4 rounded-md text-sm md:text-base"}
		>
			<motion.div
				variants={tabs}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				<AnimatedText text={"가입에 사용한 휴대폰 번호를 입력해주세요."}/>
				<motion.div
					variants={fadeSlideLeft}
					initial="hidden"
					animate="visible"
					exit="exit"
					className={"flex gap-2 mt-4"}
				>
					<Input
						type={"tel"}
						name={"phoneNumber"}
						placeholder={"휴대폰 번호를 입력해주세요."}
						theme={theme}
						onChange={handleChange}
						className={"font text-sm md:text-base"}
						value={phoneNumber}
					/>
					<Button
						theme={"dark"}
						width={"w-1/5"}
						fontSize={"text-sm md:text-base"}
						padding={"px-2 py-1.5"}
						onClick={handleFindEmail}
					>
						{
							checking ? (
								<div className="animate-spin w-5 h-5 border-t-2 border-white rounded-full mx-auto" />
							) : (
								"찾기"
							)
						}
					</Button>
				</motion.div>
				<div
					className={"mt-4 text-sm md:text-base min-h-[20px] transition-all duration-300 ease-in-out"}
				>
					해당하는 이메일이 없어요!
				</div>
			</motion.div>
		</ThemeDiv>
	);
};

export default FindEmail;