'use client'

import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { isValidPassword } from "@/util/validators";
import clsx from "clsx";
import Button from "@/components/base/Button";
import Card from "@/components/Card";
import ThemeDiv from "@/components/base/ThemeDiv";
import InputWithPasswordToggle from "@/components/base/InputWithPasswordToggle";
import AnimatedText from "@/components/base/AnimatedText";
import useToast from "@/hooks/useToast";
import useSourceValidation from "@/hooks/useSourceValidation";

const ResetPassword = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [touched, setTouched] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isPasswordChanged, setIsPasswordChanged] = useState(false);
	const { showToast } = useToast();
	const router = useRouter();
	const pathname = usePathname();
	const initialPathRef = useRef(pathname);

	// url source 포함 여부 체크
	useSourceValidation('password');

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!touched) setTouched(true);
		setPassword(e.target.value);
	};

	const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!touched) setTouched(true);
		setConfirmPassword(e.target.value);
	};

	const handleClick = async () => {
		if (!isValid) {
			showToast({
				message: '비밀번호가 유효하지 않아요!',
				iconType: 'warning',
				autoCloseTime: 3000,
			});
			return;
		}

		setIsLoading(true);
		try {
			const { error } = await supabase.auth.updateUser({ password });

			if (!error) {
				showToast({
					message: '비밀번호가 성공적으로 변경됐어요!',
					iconType: 'success',
					autoCloseTime: 3000,
				});
				setIsPasswordChanged(true);
				await supabase.auth.signOut();
				router.push('/login');
			} else {
				if (error.message?.includes('different from the old password')) {
					showToast({
						message: '기존 비밀번호와 다른 비밀번호를 사용해주세요!',
						iconType: 'warning',
						autoCloseTime: 3000,
					});
				} else {
					showToast({
						message: '비밀번호 변경에 실패했어요. 잠시 후 다시 시도해주세요.',
						iconType: 'warning',
						autoCloseTime: 3000,
					});
				}
			}
		} finally {
			setIsLoading(false);
		}
	}

	const handleLogout = async () => {
		await supabase.auth.signOut();
	};

	useEffect(() => {
		// 비밀번호 변경이 완료되지 않은 경우에만 보안 로그아웃 수행
		if (isPasswordChanged) return;
		
		// 새로고침/브라우저 닫기
		window.addEventListener('beforeunload', handleLogout);
		
		// URL 변경 감지
		const currentPath = pathname;
		if (initialPathRef.current !== currentPath) {
			handleLogout();
		}
		
		return () => window.removeEventListener('beforeunload', handleLogout);
	}, [pathname, isPasswordChanged]);

	useEffect(() => {
		const passwordValid = isValidPassword(password);
		const match = password === confirmPassword;

		if (passwordValid && match) {
			setIsValid(true);
		} else {
			setIsValid(false);
		}
	}, [password, confirmPassword]);

	const getValidationError = () => {
		if (!isValidPassword(password)) {
			return "비밀번호는 특수문자를 포함해 8자 이상 입력해주세요.";
		}
		if (password !== confirmPassword) {
			return "비밀번호가 서로 일치하지 않아요.";
		}
		return null;
	};

	return (
		<Card
			hasLogo
		>
			<ThemeDiv
				isChildren
				className={"mt-2 px-4 py-4 rounded flex flex-col md:w-2/3 md:mx-auto md:px-12 md:py-8"}
			>
				<div
					className={"text-center mb-4 text-lg font-semibold"}
				>
					{"비밀번호 재 설정"}
				</div>

				<div className={"mb-2"}>
					<AnimatedText fontSize={"text-base md:text-xl"} text={"변경 할 비밀번호를 입력해주세요!"}/>
				</div>

				<div className={"mb-4"}>
					<AnimatedText fontSize={"text-sm md:text-base"} text={"비밀번호는 특수문자를 포함해 8자 이상 작성해주세요!"} delay={0.8}/>
				</div>

				<div
					className={"flex flex-col gap-2"}
				>
					<InputWithPasswordToggle
						type={"password"}
						name={"password"}
						placeholder={"비밀번호를 입력해주세요."}
						theme={theme}
						className={"font text-md md:text-lg"}
						value={password}
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
				</div>

				<div
					className={clsx(
						"text-right text-sm min-h-[20px] mt-1 transition-all duration-300 ease-in-out",
						theme === "normal" ? "text-red-600" : "text-red-300",
						!touched || isValid ? "opacity-0 translate-y-[-4px]" : "opacity-100 translate-y-0"
					)}
				>
					{touched && getValidationError() && (
						<>
							{getValidationError()}
						</>
					)}
				</div>

				<Button
					theme={"dark"}
					fontSize="text-base"
					padding="p-2"
					className={"mt-6"}
					onClick={handleClick}
					disabled={isLoading}
				>
					{isLoading ? "변경 중..." : "변경하기"}
				</Button>
			</ThemeDiv>
		</Card>
	);
};

export default ResetPassword;