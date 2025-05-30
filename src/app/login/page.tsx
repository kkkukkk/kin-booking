'use client'

import Input from "@/components/base/Input";
import Card from "@/components/Card";
import Button from "@/components/base/Button";
import useAlert from "@/hooks/useAlert";
import {useState} from "react";
import {supabase} from "@/lib/supabaseClient";
import {useAppSelector} from "@/redux/hooks";
import {RootState} from "@/redux/store";

const LoginPage = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { showAlert, hideAlert } = useAlert();

	const handleLogin = async () => {
		const {data, error} = await supabase.auth.signInWithPassword({
			email: email,
			password: password
		});

		if (error) {
			showAlert({ type: "toast", message: "로그인 실패", autoCloseTime: 3000, });
		} else {
			showAlert({ type: "toast", message: "로그인 성공", autoCloseTime: 3000, });
		}
	}

	const handleLogOut = async () => {
		const { error } = await supabase.auth.signOut();
		if (error) {
			showAlert({ type: "toast", message: "로그아웃 실패", autoCloseTime: 3000, });
		} else {
			showAlert({ type: "toast", message: "로그아웃 성공", autoCloseTime: 3000, });
		}
	}


	return (
		<Card className={"flex flex-col gap-2"}>
			<Input placeholder="이메일" theme={theme} className={"input-base"} value={email} onChange={(e) => setEmail(e.target.value)}/>
			<Input placeholder="비밀번호" theme={theme} className={"input-base"} value={password} onChange={(e) => setPassword(e.target.value)}/>
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
				onClick={() => handleLogOut()}
			>
				{"로그아웃"}
			</Button>
		</Card>
	)
}

export default LoginPage;