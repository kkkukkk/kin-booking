'use client'

import { useEffect, useState, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { AnimatePresence, motion } from "framer-motion";
import { bottomUp, bottomUpDelay } from "@/types/ui/motionVariants";
import { RegisterStep } from "@/types/ui/registerStep";
import { useAlert } from "@/providers/AlertProvider";
import { useRegister } from "@/hooks/api/useAuth";
import { useSpinner } from "@/hooks/useSpinner";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Name from "@/app/register/components/Name";
import Email from "@/app/register/components/Email";
import Password from "@/app/register/components/Password";
import PhoneNumber from "@/app/register/components/PhoneNumber";
import Consent from "@/app/register/components/Consent";
import Button from "@/components/base/Button";
import ProgressBar from "@/components/base/ProgressBar";
import clsx from "clsx";
import useToast from "@/hooks/useToast";

const RegisterClient = () => {
	const steps: RegisterStep[] = ['consent', 'name', 'email', 'password', 'phoneNumber'];
	const theme = useAppSelector((state: RootState) => state.theme.current);
	const router = useRouter();
	const { mutateAsync: registerAsync, mutate: register, isPending } = useRegister();
	const { showToast, hideToast } = useToast();
	const { showAlert } = useAlert();
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
			message: "유효한 휴대폰 번호를 입력해주세요.",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		phoneDuplicate: {
			message: "휴대폰 번호 중복검사를 해주세요.",
			iconType: "warning",
			autoCloseTime: 3000,
		},
		registerInvalid: {
			message: "입력한 정보에 오류가 있어요. 다시 확인해주세요.",
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
			// registerAsync를 사용하여 비동기 처리
			await registerAsync({
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
				message: `인증 이메일이 발송되었습니다. 메일을 확인해 주세요.

인증 메일을 찾을 수 없다면:
• 스팸 메일함을 확인해주세요
• Gmail의 경우 '카테고리 - 프로모션' 탭도 확인해주세요
• 메일함의 다른 폴더도 확인해주세요`,
				noCancel: true,
			});

			if (confirmed) {
				router.push('/login');
			}
		} catch (error) {
			// 에러는 useRegister 훅의 onError에서 처리됨
			console.error('회원가입 중 오류 발생:', error);
		}
	};

	const canProceed = () => {
		switch (step) {
			case 'consent':
				return personalChecked && termsChecked;
			case 'name':
				return isValidName;
			case 'email':
				return isValidEmail && isDuplicateEmail === false;
			case 'password':
				return isValidPassword;
			case 'phoneNumber':
				return isValidPhone && isDuplicatePhone === false;
			default:
				return false;
		}
	}

	const getToastKey = () => {
		switch (step) {
			case 'consent': return 'consent';
			case 'name': return 'name';
			case 'email':
				if (!isValidEmail) return 'emailInvalid';
				if (isDuplicateEmail || isDuplicateEmail === null) return 'emailDuplicate';
				break;
			case 'password': return passwordValidationReason === 'invalidFormat' ? 'passwordInvalidFormat' : 'passwordNotMatch';
			case 'phoneNumber':
				if (!isValidPhone) return 'phone';
				if (isDuplicatePhone || isDuplicatePhone === null) return 'phoneDuplicate';
				break;
		}
	}

	const onNext = async () => {
		hideToast();
		if (!canProceed()) {
			const key = getToastKey();
			if (!key) return;
			showToastAlert(key);
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
		if (step === 'consent') router.push('/login');
		else if (step === 'name') setStep('consent');
		else if (step === 'phoneNumber') setStep('password');
		else if (step === 'password') setStep('email');
		else if (step === 'email') setStep('name');
	};

	const renderStep = () => {
		switch (step) {
			case 'consent':
				return (
					<Consent
						key="consent"
						personalChecked={personalChecked}
						onChangePersonal={setPersonalChecked}
						termsChecked={termsChecked}
						onChangeTerms={setTermsChecked}
						marketingChecked={marketingChecked}
						onChangeMarketing={setMarketingConsent}
					/>
				);
			case 'name':
				return (
					<Name
						key="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						isValid={isValidName}
						onValidChange={setIsValidName}
						theme={theme}
					/>
				);
			case 'email':
				return (
					<Email
						key="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						isValid={isValidEmail}
						onValidChange={setIsValidEmail}
						isDuplicateEmail={isDuplicateEmail}
						onDuplicateCheck={setIsDuplicateEmail}
						theme={theme}
					/>
				);
			case 'password':
				return (
					<Password
						key="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						isValid={isValidPassword}
						onValidChange={(valid, reason) => {
							setIsValidPassword(valid);
							setPasswordValidationReason(reason ?? '');
						}}
						theme={theme}
					/>
				);
			case 'phoneNumber':
				return (
					<PhoneNumber
						key="phoneNumber"
						value={phoneNumber}
						onChange={(e) => setPhoneNumber(e.target.value)}
						isValid={isValidPhone}
						onValidChange={setIsValidPhone}
						isDuplicatePhone={isDuplicatePhone}
						onDuplicateCheck={setIsDuplicatePhone}
						theme={theme}
					/>
				);
		}
	};

	const prevIsPending = useRef(false);

	useEffect(() => {
		if (!prevIsPending.current && isPending) {
			showSpinner();
		}
		if (prevIsPending.current && !isPending) {
			hideSpinner();
		}
		prevIsPending.current = isPending;
	}, [isPending, showSpinner, hideSpinner]);

	return (
		<div>
			<div className="flex justify-start mb-4">
				<Button
					theme={"dark"}
					padding={"px-3 py-1.5 md:px-4 md:py-1"}
					onClick={onBack}
					reverse={theme === "normal"}
					light={theme !== "normal"}
					className="font-semibold"
				>
					{step === "consent" ? "뒤로가기" : "이전"}
				</Button>
			</div>

			<ProgressBar
				steps={steps}
				currentStep={steps.indexOf(step)}
				theme={theme}
			/>

			<AnimatePresence mode="wait">
				<motion.div
					key={`${step}Motion`}
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
					["phoneNumber", "email"].includes(step) ? "mt-4 md:mt-6" : "mt-8 md:mt-10"
				)}
			>
				<Button
					theme={"dark"}
					fontSize={"text-md md:text-lg"}
					padding={"py-1.5"}
					width={"w-[50%]"}
					onClick={onNext}
					reverse={theme === "normal"}
					light={theme !== "normal"}
					className="font-semibold"
				>
					{step === "phoneNumber" ? "가입하기" : "다음"}
				</Button>
			</motion.div>
		</div>
	);
};

export default RegisterClient; 