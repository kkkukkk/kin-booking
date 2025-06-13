'use client'

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useLogin } from "@/hooks/api/useAuth";
import { useLoginImages } from "@/hooks/api/useImages";
import { useSpinner } from "@/providers/SpinnerProvider";
import Input from "@/components/base/Input";
import Card from "@/components/Card";
import Button from "@/components/base/Button";
import useToast from "@/hooks/useToast";
import InputWithPasswordToggle from "@/components/base/InputWithPasswordToggle";
import Logo from "@/components/Logo";
import ImageSlider from "@/components/slider/ImageSlider";
import Skeleton from "@/components/base/Skeleton";

interface LoginPageProps {
	onSwitch: () => void;
}

const LoginPage = ({ onSwitch }: LoginPageProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { mutate: login, isPending: loginPending, error: loginError } = useLogin();
	const { showToast } = useToast();
	const { showSpinner, hideSpinner } = useSpinner();
	const { data: images = [], isPending: imagePending, error: imagesError } = useLoginImages();

	const handleLogin = async () => {
		if (!email) {
			showToast({ iconType: "warning", message: "이메일을 입력해주세요", autoCloseTime: 3000, });
		} else if (!password) {
			showToast({ iconType: "warning", message: "비밀번호를 입력해주세요", autoCloseTime: 3000, });
		} else {
			await login({ email, password });
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};


	useEffect(() => {
		if (loginError) {
			if ((loginError as Error).message === "Invalid login credentials") {
				showToast({
					message: "이메일과 비밀번호를 확인해주세요.",
					iconType: "error",
					autoCloseTime: 3000,
				});
			} else if ((loginError as Error).message === "Email not confirmed") {
				showToast({
					message: "이메일 인증 후 로그인할 수 있어요.",
					iconType: "warning",
					autoCloseTime: 3000,
				});
			} else {
				showToast({
					message: "로그인 중 오류가 발생했습니다.",
					iconType: "error",
					autoCloseTime: 3000,
				});
			}
		}
	}, [loginError, showToast]);

	useEffect(() => {
		if (loginPending) showSpinner();
		else hideSpinner();
	}, [loginPending, showSpinner, hideSpinner]);

	return (
		<Card
			className={"flex flex-col md:flex-row gap-8 md:gap-16"}
		>
			<div
				className={"hidden md:flex justify-center item-center md:w-2/3"}
			>
				{
					imagePending
						? <Skeleton />
						: <ImageSlider
							images={images}
							width="w-full"
							height="h-full"
							interval={5000}
						/>
				}
			</div>
			<div
				className={"flex flex-col md:w-1/3 h-full gap-8 mt-2 md:gap-16 md:mt-8"}
			>
				<div
					className={"flex justify-center items-center flex-grow-[2]"}
				>
					<Logo />
				</div>
				<div
					className={"flex flex-col gap-2 flex-grow-[3.5]"}
				>
					<Input placeholder="이메일" name={"email"} theme={theme} className={"input-base"} value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyPress} />
					<InputWithPasswordToggle placeholder="비밀번호" name={"password"} theme={theme} className={"input-base"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyPress} />
					<Button
						type="button"
						theme={"dark"}
						padding={"py-1"}
						onClick={() => handleLogin()}
					>
						{"로그인"}
					</Button>
					<Button
						type="button"
						theme={"dark"}
						padding={"py-1"}
						onClick={onSwitch}
					>
						{"회원가입"}
					</Button>
				</div>
			</div>
		</Card>
	)
}

export default LoginPage;