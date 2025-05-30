'use client'

import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { useState } from "react";
import Card from "@/components/Card";
import Input from "@/components/base/Input";
import Button from "@/components/base/Button";
import {supabase} from "@/lib/supabaseClient";

const RegisterPage = () => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	const handleRegister = async () => {
		if (!email || !name || !password || !phoneNumber) {
			alert('모든 정보를 입력해주세요.');
			return;
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: {
					display_name: name,
					phone_number: phoneNumber,
				}
			}
		});
		if (error) console.log(error.message);
		if (data)  {
			console.log(data);
			await supabase.auth.signOut();
		}

		// confirm 로그인 하시겠습니까?
	}


	return (
		<Card className={'flex flex-col gap-2'}>
			<Input placeholder='이메일' theme={theme} className={'input-base'} value={email} onChange={(e) => setEmail(e.target.value)}/>
			<Input placeholder='이름' theme={theme} className={'input-base'} value={name} onChange={(e) => setName(e.target.value)}/>
			<Input placeholder='비밀번호' theme={theme} className={'input-base'} value={password} onChange={(e) => setPassword(e.target.value)}/>
			<Input placeholder='전화번호' theme={theme} className={'input-base'} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
			<Button
				type="button"
				theme={"dark"}
				onClick={handleRegister}
			>
				{'회원가입'}
			</Button>
		</Card>
	)
}

export default RegisterPage;