'use client'

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
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
import useSourceLogout from '@/hooks/useSourceLogout';

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
	const searchParams = useSearchParams();

	// url source 포함 여부 체크
	useSourceValidation('password');
	useSourceLogout('password');

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
			console.log("비밀번호 변경 시도 중...");
			
			// 먼저 현재 세션 확인
			const { data: { session }, error: sessionError } = await supabase.auth.getSession();
			console.log("현재 세션:", session);
			
			if (sessionError) {
				console.error("세션 확인 오류:", sessionError);
				showToast({
					message: `세션 확인 실패: ${sessionError.message}`,
					iconType: 'error',
					autoCloseTime: 3000,
				});
				return;
			}
			
			if (!session) {
				console.error("세션이 없습니다. 이메일 링크를 다시 확인해주세요.");
				showToast({
					message: '세션이 만료되었습니다. 비밀번호 재설정 링크를 다시 요청해주세요.',
					iconType: 'error',
					autoCloseTime: 3000,
				});
				return;
			}
			
			const { error } = await supabase.auth.updateUser({ password });

			if (!error) {
				console.log("비밀번호 변경 성공, 즉시 로그아웃 처리 중...");
				showToast({
					message: '비밀번호가 성공적으로 변경됐어요!\n\n새 비밀번호로 다시 로그인해주세요.',
					iconType: 'success',
					autoCloseTime: 5000,
				});
				setIsPasswordChanged(true);
				
				// 즉시 로그아웃 (보안상)
				await supabase.auth.signOut();
				console.log("비밀번호 변경 후 로그아웃 완료");
				
				// 로그인 페이지로 이동
				router.push('/login');
			} else {
				console.error("비밀번호 변경 오류:", error);
				if (error.message?.includes('different from the old password')) {
					showToast({
						message: '기존 비밀번호와 다른 비밀번호를 사용해주세요!',
						iconType: 'warning',
						autoCloseTime: 3000,
					});
				} else {
					showToast({
						message: `비밀번호 변경에 실패했어요: ${error.message}`,
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
		console.log("보안 로그아웃 실행 중...");
		await supabase.auth.signOut();
		console.log("보안 로그아웃 완료");
	};

	useEffect(() => {
		// 비밀번호 변경이 완료되지 않은 경우에만 보안 로그아웃 수행
		if (isPasswordChanged) {
			console.log("비밀번호 변경 완료됨, 보안 로그아웃 스킵");
			return;
		}

		console.log("보안 로그아웃 이벤트 리스너 등록");

		// 새로고침/브라우저 닫기
		const handleBeforeUnload = () => {
			console.log("페이지 새로고침/닫기 감지, 로그아웃 실행");
			handleLogout();
		};
		
		window.addEventListener('beforeunload', handleBeforeUnload);

		// URL 변경 감지 (페이지 이동)
		if (initialPathRef.current !== pathname) {
			console.log("페이지 이동 감지, 로그아웃 실행");
			handleLogout();
		}

		return () => {
			console.log("보안 로그아웃 이벤트 리스너 제거");
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
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

	// 페이지 로드 시 세션 확인 및 URL 파라미터 처리
	useEffect(() => {
		const checkSessionAndHandleAuth = async () => {
			console.log("페이지 로드 시 세션 확인 중...");
			
			// URL에서 access_token과 refresh_token 확인
			const urlParams = new URLSearchParams(window.location.hash.substring(1));
			const accessToken = urlParams.get('access_token');
			const refreshToken = urlParams.get('refresh_token');
			
			console.log("URL 파라미터:", { accessToken: !!accessToken, refreshToken: !!refreshToken });
			
			if (accessToken && refreshToken) {
				console.log("URL에서 토큰 발견, 임시 세션 설정 중...");
				const { data, error } = await supabase.auth.setSession({
					access_token: accessToken,
					refresh_token: refreshToken
				});
				
				if (error) {
					console.error("세션 설정 오류:", error);
					showToast({
						message: '세션 설정에 실패했습니다. 링크를 다시 확인해주세요.',
						iconType: 'error',
						autoCloseTime: 3000,
					});
					return;
				}
				
				console.log("임시 세션 설정 성공:", data.session);
				
				// URL에서 토큰 제거 (보안상)
				window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
			}
			
			// 최종 세션 확인
			const { data: { session }, error } = await supabase.auth.getSession();
			console.log("최종 세션:", session);
			
			if (error) {
				console.error("세션 확인 오류:", error);
			}
			
			if (!session) {
				console.log("세션이 없습니다. 이메일 링크를 통해 접근했는지 확인해주세요.");
			}
		};
		
		checkSessionAndHandleAuth();
	}, [showToast]);

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
					<AnimatedText fontSize={"text-base md:text-xl"} text={"변경 할 비밀번호를 입력해주세요!"} />
				</div>

				<div className={"mb-4"}>
					<AnimatedText fontSize={"text-sm md:text-base"} text={"비밀번호는 특수문자를 포함해 8자 이상 작성해주세요!"} delay={0.8} />
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
					className={"mt-6 font-semibold"}
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