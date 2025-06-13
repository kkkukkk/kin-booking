'use client'

import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { bottomUp, bottomUpDelay } from "@/types/ui/motionVariants";
import { RegisterStep } from "@/types/ui/registerStep";
import { useAlert } from "@/providers/AlertProvider";
import { useLogin, useRegister } from "@/hooks/api/useAuth";
import { useSpinner } from "@/providers/SpinnerProvider";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { getErrorMessage } from "@/components/utils/error";
import Card from "@/components/Card";
import Name from "@/app/join/forms/registerSteps/Name";
import Email from "@/app/join/forms/registerSteps/Email";
import Password from "@/app/join/forms/registerSteps/Password";
import PhoneNumber from "@/app/join/forms/registerSteps/PhoneNumber";
import Consent from "@/app/join/forms/registerSteps/Consent";
import Button from "@/components/base/Button";
import ProgressBar from "@/components/base/ProgressBar";
import clsx from "clsx";
import useToast from "@/hooks/useToast";

interface RegisterPageProps {
	onSwitch: () => void;
}

const RegisterPage = ({ onSwitch }: RegisterPageProps) => {
	const steps: RegisterStep[] = ['consent', 'name', 'email', 'password', 'phoneNumber'];
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const router = useRouter();
	const { mutate: register, isPending } = useRegister();
	const { mutate: login } = useLogin();
	const { showToast, hideToast } = useToast();
	const { showAlert, hideAlert } = useAlert();
	const { showSpinner, hideSpinner } = useSpinner();

	const [step, setStep] = useState<RegisterStep>('consent');

	const [personalChecked, setPersonalChecked] = useState(false);
	const [termsChecked, setTermsChecked] = useState(false);
	const [marketingChecked, setMarketingConsent] = useState(false);

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordValidationReason, setPasswordValidationReason] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	const [isValidName, setIsValidName] = useState(false);
	const [isValidEmail, setIsValidEmail] = useState(false);
	const [isValidPassword, setIsValidPassword] = useState(false);
	const [isValidPhone, setIsValidPhone] = useState(false);

	const [isDuplicateEmail, setIsDuplicateEmail] = useState<boolean | null>(null);
	const [isDuplicatePhone, setIsDuplicatePhone] = useState<boolean | null>(null);

	const toastConfigs = {
		consent: {
			message: "필수 항목에 동의해주세요!",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		name: {
			message: "이름을 2자 이상 입력해주세요!",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		emailInvalid: {
			message: "유효한 이메일을 입력해주세요.",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		emailDuplicate: {
			message: "이메일 중복검사를 해주세요.",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		passwordInvalidFormat: {
			message: "비밀번호는 특수문자 포함 8자 이상 입력해주세요.",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		passwordNotMatch: {
			message: "비밀번호가 서로 일치하지 않아요.",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		phone: {
			message: "유효한 핸드폰 번호를 입력해주세요.",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		phoneDuplicate: {
			message: "핸드폰 번호 중복검사를 해주세요.",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		registerInvalid: {
			message: "입력한 정보에 오류가 있어요. 다시 확인해주세요.",
			iconType: "error",
			autoCloseTime: 3000,
		},
		registerDuplicated: {
			message: "이미 등록된 이메일이에요.",
			iconType: "error",
			autoCloseTime: 3000,
		}
	} as const;

	const showToastAlert = (key: keyof typeof toastConfigs) => {
		const { message, iconType, autoCloseTime } = toastConfigs[key];
		showToast({
			message,
			iconType,
			autoCloseTime,
		});
	};

	const handleRegister = async () => {
		if (!isValidName || !isValidEmail || !isValidPassword || !isValidPhone) {
			showToastAlert('registerInvalid');
			return;
		}

		try {
			await register({
				email,
				password,
				name,
				phoneNumber,
				marketingConsent: marketingChecked,
			});

			await supabase.auth.signOut();

			const confirmed = await showAlert({
				type: 'confirm',
				title: '가입 완료!',
				message: '인증 이메일이 발송되었습니다. 메일을 확인해 주세요.',
				noCancel: true,
			});

			/* 자동 로그인
			if (confirmed) {
				try {
					await login({
						email,
						password,
					});
					router.push('/')
					return;
				} catch {
					showToast({
						message: '오류가 발생했습니다.',
						iconType: 'error',
						autoCloseTime: 3000,
					});
				}
			}
			*/

			onSwitch();
		} catch (error) {
			const message = getErrorMessage(error);
			if (message.includes('already registered')) {
				showToast({ message: '이미 등록된 이메일이에요.', iconType: 'error', autoCloseTime: 3000 });
			} else {
				showToast({ message: `회원가입 중 오류가 발생했어요. (${message})`, iconType: 'error', autoCloseTime: 3000 });
			}
		}
	};

	const canProceed = () => {
		switch (step) {
			case 'consent':
				return personalChecked && termsChecked;
			case 'name':
				return isValidName;
			case 'email':
				return isValidEmail && !isDuplicateEmail;
			case 'password':
				return isValidPassword;
			case 'phoneNumber':
				return isValidPhone && !isDuplicatePhone;
			default:
				return false;
		}
	}

	const getToastKey = () => {
		switch (step) {
			case 'consent': return 'consent';
			case 'name': return 'name';
			case 'email': return isDuplicateEmail ? 'emailDuplicate' : 'emailInvalid';
			case 'password': return passwordValidationReason === 'invalidFormat' ? 'passwordInvalidFormat' : 'passwordNotMatch';
			case 'phoneNumber': return isDuplicatePhone ? 'phoneDuplicate' : 'phone';
		}
	}

	const onNext = async () => {
		hideToast();
		if (!canProceed()) {
			showToastAlert(getToastKey());
			return;
		}

		if (step === 'phoneNumber') {
			const confirmed = await showAlert({
				type: 'confirm',
				title: '확인',
				message: `이름: ${name}\n이메일: ${email}\n휴대폰번호: ${phoneNumber.replace(/[^0-9]/g, '')}\n\n해당 정보로 가입할까요?`,
			});
			if (confirmed) {
				await handleRegister();
			}

		} else {
			const currentIndex = steps.indexOf(step);
			setStep(steps[currentIndex + 1]);
		}
	};

	const onBack = () => {
		hideToast();
		if (step === 'consent') onSwitch();
		else if (step === 'name') setStep('consent');
		else if (step === 'phoneNumber') setStep('password');
		else if (step === 'password') setStep('email');
		else if (step === 'email') setStep('name');
	};

	const renderStep = () => {
		switch(step) {
			case 'consent':
				return <Consent
					key={"consent"}
					personalChecked={personalChecked}
					onChangePersonal={setPersonalChecked}
					termsChecked={termsChecked}
					onChangeTerms={setTermsChecked}
					marketingChecked={marketingChecked}
					onChangeMarketing={setMarketingConsent}
				/>;
			case 'name':
				return <Name
					key={"name"}
					value={name}
					onChange={(e) => setName(e.target.value)}
					isValid={isValidName}
					onValidChange={setIsValidName}
					theme={theme}
				/>;
			case 'email':
				return <Email
					key={"email"}
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					isValid={isValidEmail}
					onValidChange={setIsValidEmail}
					isDuplicateEmail={isDuplicateEmail}
					onDuplicateCheck={setIsDuplicateEmail}
					theme={theme}
				/>
			case 'password':
				return <Password
					key={"password"}
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					isValid={isValidPassword}
					onValidChange={(valid, reason) => {
						setIsValidPassword(valid);
						setPasswordValidationReason(reason ?? '');
					}}
					theme={theme}
				/>;
			case 'phoneNumber':
				return <PhoneNumber
					key={"phoneNumber"}
					value={phoneNumber}
					onChange={(e) => setPhoneNumber(e.target.value)}
					isValid={isValidPhone}
					onValidChange={setIsValidPhone}
					isDuplicatePhone={isDuplicatePhone}
					onDuplicateCheck={setIsDuplicatePhone}
					theme={theme}
				/>;
		}
	};

	useEffect(() => {
		if (isPending) showSpinner();
		else hideSpinner();
	}, [isPending, showSpinner, hideSpinner]);

	return (
		<Card>
			<Button
				theme={"dark"}
				padding={"px-2 py-1.5"}
				onClick={onBack}
			>
				{"뒤로가기"}
			</Button>

			<ProgressBar
				steps={steps}
				currentStep={steps.indexOf(step)}
			    theme={theme}
			/>


			<AnimatePresence mode="wait">
				<motion.div
					key={`${step}Motion`}   // step 변경시 exit + enter 애니메이션 실행
					variants={{
						initial: { opacity: 1 },
						animate: { opacity: 1 },
						exit: { opacity: 0, transition: { duration: 0.1 } }
					}}
					initial="initial"
					animate="animate"
					exit="exit"
					className={"mt-1"}
				>
					{renderStep()}
				</motion.div>
			</AnimatePresence>

			<motion.div
				key={`${step}Button`}
				variants={step === "consent" ? bottomUpDelay : bottomUp}
				initial="initial"
				animate="animate"
				className={clsx(
					"flex justify-end",
					step === "email" ? "mt-4 md:mt-6" : "mt-8 md:mt-10"
				)}
			>
				<Button
					theme={"dark"}
					width={"100%"}
					fontSize={"text-md md:text-xl"}
					padding={"px-2 py-1.5"}
					onClick={onNext}
				>
					{step === "phoneNumber" ? "가입하기" : "다음"}
				</Button>
			</motion.div>
		</Card>
	)
}

export default RegisterPage;