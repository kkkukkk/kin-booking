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
	const [resultEmail, setResultEmail] = useState<string | null>(null);
	const [noResult, setNoResult] = useState(false);
	const { showToast } = useToast();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const input = e.target.value;
		const filtered = input.replace(/[^0-9-\s]/g, '');
		setPhoneNumber(filtered);
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			handleFindEmail();
		}
	};

	const maskEmail = (email: string): string => {
		const [user, domain] = email.split('@');
		if (user.length <= 2) return `${user[0]}***@${domain}`;
		const visible = user.slice(0, 2);
		return `${visible}${'*'.repeat(user.length - 2)}@${domain}`;
	};

	const handleFindEmail = async () => {
		const digits = phoneNumber.replace(/[^0-9]/g, '');

		setChecking(true);

		const { data, error } = await supabase.rpc("find_user_email_by_phone", {
			input_phone_number: digits,
		});

		setChecking(false);

		if (error) {
			console.error("휴대폰 번호 체크 실패:", error.message);
			showToast({
				message: "확인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
				autoCloseTime: 3000,
				iconType: "error",
			});
			return;
		} else {
			if (data) {
				setResultEmail(data);
				setNoResult(false);
			} else {
				setResultEmail(null);
				setNoResult(true);
				showToast({
					message: "등록된 이메일이 없어요.",
					iconType: "warning",
					autoCloseTime: 3000,
				});
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
						onKeyDown={handleKeyDown}
						maxLength={13}
					/>
					<Button
						theme={"dark"}
						width={"w-1/5"}
						fontSize={"text-sm md:text-base"}
						padding={"px-2 py-1.5"}
						onClick={handleFindEmail}
						disabled={checking || phoneNumber.trim() === ""}
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
					className={"mt-4 text-sm md:text-base min-h-[20px] transition-all duration-300 ease-in-out break-words whitespace-normal break-normal"}
				>
					{resultEmail &&
						<div>
							입력한 휴대폰 번호로 가입된 이메일을 찾았어요!
							<br />이메일: <span className={"font-semibold"}>{maskEmail(resultEmail)}</span>
						</div>
					}
					{noResult && <span className="text-red-400">해당하는 이메일이 없어요!</span>}
				</div>
			</motion.div>
		</ThemeDiv>
	);
};

export default FindEmail;