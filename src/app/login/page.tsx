'use client'

import React, { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useLogin } from "@/hooks/api/useAuth";
import { useLoginImages } from "@/hooks/api/useImages";
import { useSpinner } from "@/hooks/useSpinner";
import { useRouter } from "next/navigation";
import Input from "@/components/base/Input";
import Card from "@/components/Card";
import Button from "@/components/base/Button";
import useToast from "@/hooks/useToast";
import InputWithPasswordToggle from "@/components/base/InputWithPasswordToggle";
import Logo from "@/components/Logo";
import ImageSlider from "@/components/slider/ImageSlider";
import Skeleton from "@/components/base/Skeleton";
import Link from "next/link";
import { useSession } from "@/hooks/useSession";
import clsx from "clsx";

const LoginPage = () => {
	const router = useRouter();
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { mutate: login, isPending: loginPending } = useLogin();
	const { showToast } = useToast();
	const { showSpinner, hideSpinner } = useSpinner();
	const { data: images = [], isPending: imagePending } = useLoginImages();
	const { session, loading } = useSession();
	const prevLoginPending = useRef(false);

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleLogin();
		}
	};

	const handleLogin = async () => {
		if (!email) {
			showToast({ iconType: "warning", message: "이메일을 입력해주세요", autoCloseTime: 3000, });
		} else if (!password) {
			showToast({ iconType: "warning", message: "비밀번호를 입력해주세요", autoCloseTime: 3000, });
		} else {
			await login({ email, password });
		}
	}

	useEffect(() => {
		if (!prevLoginPending.current && loginPending) {
			showSpinner();
		}
		if (prevLoginPending.current && !loginPending) {
			hideSpinner();
		}
		prevLoginPending.current = loginPending;
	}, [loginPending, showSpinner, hideSpinner]);

	useEffect(() => {
		if (!loading && session) {
			const isEmailVerified = !!session.user.email_confirmed_at;
			if (isEmailVerified) {
				router.replace("/");
			}
		}
	}, [loading, session, router]);

	if (loading || (session && session.user.email_confirmed_at)) {
		return null;
	}

	return (
		<Card
			className={"flex flex-col md:flex-row gap-8 md:gap-16"}
		>
			<div
				className={"hidden md:flex justify-center item-center md:w-2/3"}
			>
				{
					imagePending
						? <Skeleton width="w-full" height="h-full" className="rounded" />
						: <ImageSlider
							images={images}
							width="w-full"
							height="h-full"
							interval={5000}
							priority={true}
						/>
				}
			</div>
			<div
				className={"flex flex-col md:w-1/3 h-full gap-8 mt-2 md:gap-16 md:mt-8"}
			>
				<div
					className={"flex justify-center items-center flex-grow-[2]"}
				>
					<Logo width={400} priority={true}/>
				</div>
				<div
					className={"flex flex-col gap-2 flex-grow-[3.5]"}
				>
					<Input placeholder="이메일" name={"email"} fontSize={"text-sm md:text-xl"} theme={theme} className={"input-base"} value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyPress} />
					<InputWithPasswordToggle placeholder="비밀번호" name={"password"} fontSize={"text-sm md:text-xl"} theme={theme} className={"input-base"} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyPress} />
					<Button
						type="button"
						theme={"dark"}
						padding={"py-1"}
						fontSize={"text-sm md:text-lg"}
						onClick={() => handleLogin()}
						reverse={theme === "normal"}
						light={theme !== "normal"}
					>
						{"로그인"}
					</Button>
					<Button
						type="button"
						theme={"dark"}
						padding={"py-1"}
						fontSize={"text-sm md:text-lg"}
						onClick={() => router.push('/register')}
						reverse={theme === "normal"}
						light={theme !== "normal"}
					>
						{"회원가입"}
					</Button>
					<div
						className={"text-sm text-right mt-2 md:text-base"}
					>
						<Link
							href={"/auth/find"}
							className={clsx(
								theme === "normal" ? "bg-green-100/90" : "bg-green-700/70",
								"cursor-pointer px-2.5 py-1 rounded shadow-md"
							)}
							tabIndex={0}
						>
							{"로그인 정보를 잊으셨나요?"}
						</Link>
					</div>
				</div>
			</div>
		</Card>
	)
}

export default LoginPage;