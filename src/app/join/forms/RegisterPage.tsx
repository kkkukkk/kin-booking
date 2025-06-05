'use client'

import { supabase } from "@/lib/supabaseClient";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { bottomUp, bottomUpDelay } from "@/types/ui/motionVariants";
import Card from "@/components/Card";
import Name from "@/app/join/forms/registerSteps/Name";
import Email from "@/app/join/forms/registerSteps/Email";
import Password from "@/app/join/forms/registerSteps/Password";
import PhoneNumber from "@/app/join/forms/registerSteps/PhoneNumber";
import Consent from "@/app/join/forms/registerSteps/Consent";
import Button from "@/components/base/Button";

interface RegisterPageProps {
	onSwitch: () => void;
}

type Step = 'consent' | 'name' | 'email' | 'password' | 'phoneNumber' | 'done';

const RegisterPage = ({ onSwitch }: RegisterPageProps) => {
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const [step, setStep] = useState<Step>('consent');

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	const [isValidName, setIsValidName] = useState(false);
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isValidPassword, setIsValidPassword] = useState(false);
	const [isValidPhone, setIsValidPhone] = useState(false);

	const handleRegister = async () => {
		if (!isValidName || !isValidEmail || !isValidPassword || !isValidPhone) {
			alert('입력한 정보에 오류가 있어요. 다시 확인해주세요.');
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

	const onNext = () => {
		if (step === 'consent') setStep('name');
		else if (step === 'name' && isValidName) setStep('email');
		else if (step === 'email' && isValidEmail) setStep('password');
		else if (step === 'password' && isValidPassword) setStep('phoneNumber');
		else if (step === 'phoneNumber' && isValidPhone && isValidName && isValidEmail && isValidPassword) handleRegister();
	};

	const onBack = () => {
		if (step === 'consent') onSwitch();
		else if (step === 'name') setStep('consent');
		else if (step === 'phoneNumber') setStep('password');
		else if (step === 'password') setStep('email');
		else if (step === 'email') setStep('name');
	};


	return (
		<Card>
			<Button
				theme={"dark"}
				padding={"px-2 py-1.5"}
				onClick={onBack}
			>
				{"뒤로가기"}
			</Button>
			<div
				className={"mt-5"}
			>
				{step === 'consent' &&
				  <Consent onNext={onNext}/>}
				{step === 'name' &&
					<Name value={name} onChange={(e) => setName(e.target.value)} onValidChange={setIsValidName} theme={theme}/>}
				{step === 'email' &&
					<Email value={email} onChange={(e) => setEmail(e.target.value)} onValidChange={setIsValidEmail} theme={theme}/>}
				{step === 'password' &&
					<Password value={password} onChange={(e) => setPassword(e.target.value)} onValidChange={setIsValidPassword} theme={theme}/>}
				{step === 'phoneNumber' &&
					<PhoneNumber value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} onValidChange={setIsValidPhone} theme={theme}/>}
			</div>
			<motion.div
				key={step}
				variants={step === 'consent' ? bottomUpDelay : bottomUp}
				initial="initial"
				animate="animate"
				exit="exit"
				className={"flex justify-end mt-8 md:mt-10"}
			>
				<Button
					theme={"dark"}
					widthPx={"100%"}
					fontSize={"text-md md:text-xl"}
					padding={"px-2 py-1.5"}
					onClick={onNext}
				>
					{'다음'}
				</Button>
			</motion.div>
		</Card>
	)
}

export default RegisterPage;