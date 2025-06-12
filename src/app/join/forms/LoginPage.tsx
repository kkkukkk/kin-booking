'use client'

import Input from "@/components/base/Input";
import Card from "@/components/Card";
import Button from "@/components/base/Button";
import useToast from "@/hooks/useToast";
import {useEffect, useState} from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useLogin } from "@/hooks/api/useAuth";
import InputWithPasswordToggle from "@/components/base/InputWithPasswordToggle";
import {useSpinner} from "@/providers/SpinnerProvider";

interface LoginPageProps {
	onSwitch: () => void;
}

const LoginPage = ({ onSwitch }: LoginPageProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { mutate: login, isPending, error } = useLogin();
	const { showToast } = useToast();
	const { showSpinner, hideSpinner } = useSpinner();

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
		if (error) {
			if ((error as Error).message === "Invalid login credentials") {
				showToast({
					message: "이메일과 비밀번호를 확인해주세요.",
					iconType: "error",
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
	}, [error, showToast]);

	useEffect(() => {
		if (isPending) showSpinner();
		else hideSpinner();
	}, [isPending]);

	return (
		<Card
			className={"flex flex-col gap-2"}
		>
			<Input placeholder="이메일" name={"email"} theme={theme} className={"input-base"} value={email} onChange={(e) => setEmail(e.target.value)}/>
			<InputWithPasswordToggle placeholder="비밀번호" name={"password"} theme={theme} className={"input-base"} value={password} onChange={(e) => setPassword(e.target.value)}/>
			<Button
				type="button"
				theme={"dark"}
				onClick={() => handleLogin()}
			>
				{"로그인"}
			</Button>
			<Button
				type="button"
				theme={"dark"}
				onClick={onSwitch}
			>
				{"회원가입"}
			</Button>
		</Card>
	)
}

export default LoginPage;