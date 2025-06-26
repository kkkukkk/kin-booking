'use client'

import ThemeDiv from "@/components/base/ThemeDiv";
import { motion } from "framer-motion";
import { fadeSlideLeft, tabs } from "@/types/ui/motionVariants";
import AnimatedText from "@/components/base/AnimatedText";
import React, { useState} from "react";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import useToast from "@/hooks/useToast";
import { supabase } from "@/lib/supabaseClient";

const FindPassword = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [email, setEmail] = useState<string>("");
	const [phoneNumber, setPhoneNumber] = useState<string>("");
	const [checking, setChecking] = useState<boolean>(false);
	const [hasResult, setHasResult] = useState<boolean | null>(null);
	const { showToast } = useToast();

	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		setEmail(input);
	}

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		const filtered = input.replace(/[^0-9-\s]/g, '');
		setPhoneNumber(filtered);
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleFindPassword();
		}
	};

	const handleFindPassword = async () => {
		const digits = phoneNumber.replace(/[^0-9]/g, '');

		setChecking(true);

		const { data, error } = await supabase.rpc('check_user_exists', {
			input_email: email,
			input_phone: digits,
		});

		setChecking(false);

		if (error) {
			console.error("에러:", error.message);
			showToast({
				message: "확인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
				autoCloseTime: 3000,
				iconType: "error",
			});
			setHasResult(null);
			return;
		} else {
			if (data)  {
				const { error } = await supabase.auth.resetPasswordForEmail(email, {
					redirectTo: 'https://kin-booking.vercel.app/auth/reset-password?source=password',
					//redirectTo: 'http://localhost:3000/auth/reset-password?source=password',
				});

				if (error) {
					showToast({
						message: "확인 중 오류가 발생했어요. error: " + error.message,
						autoCloseTime: 3000,
						iconType: "error",
					});
					setHasResult(null);
				} else  {
					showToast({
						message: "비밀번호 재 설정 메일을 보냈어요. 변경 후 이용해주세요!",
						autoCloseTime: 3000,
						iconType: "success",
					});
					setHasResult(true);
				}
			} else {
				showToast({
					message: "입력한 정보로 가입된 계정이 없는 것 같아요.",
					autoCloseTime: 3000,
					iconType: "error",
				});
				setHasResult(false);
			}
		}
	}

	return (
		<ThemeDiv
			className={"p-4 rounded-md text-sm md:text-base"}
			isChildren
		>
			<motion.div
				variants={tabs}
				initial="initial"
				animate="animate"
				exit="exit"
				style={
					{ maxHeight: "100%", height: "100%", overflow: "hidden" }
				}
			>
				<AnimatedText text={"가입에 사용한 정보를 입력해주세요."}/>
				<motion.div
					variants={fadeSlideLeft}
					initial="hidden"
					animate="visible"
					exit="exit"
					className={"flex gap-2 mt-4"}
				>
					<div className={"w-full flex flex-col gap-2"}>
						<Input
							type={"email"}
							name={"email"}
							placeholder={"이메일을 입력해주세요."}
							theme={theme}
							onChange={handleEmailChange}
							className={"font text-sm md:text-base"}
							value={email}
							onKeyDown={handleKeyDown}
						/>
						<Input
							type={"tel"}
							name={"phoneNumber"}
							placeholder={"휴대폰 번호를 입력해주세요."}
							theme={theme}
							onChange={handlePhoneChange}
							className={"font text-sm md:text-base"}
							value={phoneNumber}
							onKeyDown={handleKeyDown}
							maxLength={13}
						/>
					</div>
					<Button
						theme={"dark"}
						width={"w-1/5"}
						fontSize={"text-sm md:text-base"}
						padding={"px-2 py-1.5"}
						onClick={handleFindPassword}
						disabled={checking || email.trim() === "" || phoneNumber.trim() === ""}
					>
						{
							checking ? (
								<div className="animate-spin w-5 h-5 border-t-2 border-white rounded-full mx-auto"/>
							) : (
								"찾기"
							)
						}
					</Button>
				</motion.div>
				<div
					className={"mt-4 text-sm md:text-base min-h-[20px] transition-all duration-300 ease-in-out break-words whitespace-normal break-normal"}
				>

					{(hasResult !== null && hasResult === false) && <span className="text-red-400">해당하는 계정이 없어요!</span>}
				</div>
			</motion.div>
		</ThemeDiv>
	);
};

export default FindPassword;