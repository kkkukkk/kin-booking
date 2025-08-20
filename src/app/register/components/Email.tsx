'use client'

import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { fadeSlideLeft } from "@/types/ui/motionVariants";
import { Theme } from "@/types/ui/theme";
import { ThumbUpIcon } from "@/components/icon/ThumbUpIcon";
import { isValidEmail } from "@/util/validators";
import Input from "@/components/base/Input";
import clsx from "clsx";
import Button from "@/components/base/Button";
import useToast from "@/hooks/useToast";
import AnimatedTextWithIcon from "@/components/base/AnimatedTextWithIcon";
import { MailIcon } from "@/components/icon/MailIcon";
import { BulbIcon } from "@/components/icon/BulbIcon";

interface EmailProps {
	key: string;
	value: string,
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
	isValid: boolean;
	onValidChange: (isValid: boolean) => void;
	isDuplicateEmail: boolean | null;
	onDuplicateCheck: (isDuplicateEmail: boolean | null) => void;
	theme?: Theme,
}

const Email = ({
	value,
	onChange,
	isValid,
	onValidChange,
	isDuplicateEmail,
	onDuplicateCheck,
	theme,
}: EmailProps,) => {
	const { showToast } = useToast();
	const [touched, setTouched] = useState(false);
	const [localPart, setLocalPart] = useState('');
	const [domain, setDomain] = useState('');
	const [checking, setChecking] = useState(false);

	// 자주 사용하는 도메인 목록
	const commonDomains = [
		{ value: '직접입력', label: '직접 입력' },
		{ value: 'gmail.com', label: 'Gmail' },
		{ value: 'naver.com', label: 'Naver' },
		{ value: 'daum.net', label: 'Daum' },
		{ value: 'kakao.com', label: 'Kakao' },
		{ value: 'outlook.com', label: 'Outlook' }
	];

	// 최종 이메일 값 구성
	const finalEmail = localPart && domain ? `${localPart}@${domain}` : localPart;

	// 초기값 설정 및 부모와 동기화
	useEffect(() => {
		if (value && value.includes('@')) {
			const [local, domainPart] = value.split('@');
			setLocalPart(local);
			setDomain(domainPart);
		} else if (value) {
			setLocalPart(value);
			setDomain('');
		}
	}, [value]);

	// 부모 컴포넌트에 값 변경 알림 (무한루프 방지)
	useEffect(() => {
		// 초기 로딩 시에는 호출하지 않음
		if (finalEmail !== value && finalEmail !== '' && (localPart || domain) && value !== '') {
			onChange({
				target: { value: finalEmail }
			} as React.ChangeEvent<HTMLInputElement>);
		}
	}, [localPart, domain]);

	// 유효성 검사만 수행 (중복확인 상태 변경 없음)
	useEffect(() => {
		const valid = isValidEmail(finalEmail);
		onValidChange?.(valid);
	}, [finalEmail, onValidChange]);

	// 에러 메시지 생성
	const getErrorMessage = () => {
		if (!touched) return null;
		
		// 이메일 아이디가 비어있는지 체크
		if (!localPart || localPart.trim() === '') {
			return "이메일 아이디를 입력해주세요.";
		}
		
		// 이메일 아이디 형식 체크 (한글, 특수문자 제한)
		const emailIdRegex = /^[a-zA-Z0-9._-]+$/;
		if (!emailIdRegex.test(localPart)) {
			return "영문, 숫자, 점(.), 언더바(_), 하이픈(-)만 사용 가능합니다.";
		}
		
		return null;
	};

	const errorMessage = getErrorMessage();

	// 도메인 선택 처리
	const handleDomainSelect = (selectedDomain: string) => {
		if (selectedDomain === '직접입력') {
			setDomain('');
			onDuplicateCheck?.(null);
		} else {
			// 기존값과 동일한 도메인을 다시 선택한 경우 무시
			if (domain === selectedDomain) {
				return;
			}
			setDomain(selectedDomain);
			onDuplicateCheck?.(null);
		}
	};

	// 로컬 파트 변경 처리
	const handleLocalPartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newLocalPart = e.target.value;
		setLocalPart(newLocalPart);
		handleChange(e);
		// 입력값 변경 시 중복확인 상태 초기화
		onDuplicateCheck?.(null);
	};

	// 도메인 직접 입력 처리
	const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newDomain = e.target.value;
		setDomain(newDomain);
		handleChange(e);
		// 입력값 변경 시 중복확인 상태 초기화
		onDuplicateCheck?.(null);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!touched) setTouched(true);
		onChange(e);
	};

	// 중복검사
	const checkDuplicateEmail = async () => {
		// 도메인 체크
		if (!domain || domain.trim() === '') {
			showToast({
				message: "도메인을 입력해주세요.",
				autoCloseTime: 3000,
				iconType: "warning",
			});
			return;
		}

		// 도메인 형식 체크 (직접입력일 때만)
		const isDirectInput = !commonDomains.some(d => d.value !== '직접입력' && d.value === domain);
		
		if (isDirectInput && !domain.includes('.')) {
			showToast({
				message: "도메인 형식에 맞춰 입력해주세요. 예) gmail.com",
				autoCloseTime: 3000,
				iconType: "warning",
			});
			return;
		}

		if (!isValid) {
			showToast({
				message: "올바른 이메일을 입력해주세요.",
				autoCloseTime: 3000,
				iconType: "warning",
			});
			return;
		}

		setChecking(true);

		// Supabase 이메일 중복 여부 체크
		// Authentication 저장 시 users 테이블에도 저장되므로 users 테이블에서 조회하는 함수 (rls 권한 때문)
		const { data, error } = await supabase.rpc("check_email_duplicate", {
			input_email: finalEmail,
		});

		setChecking(false);

		if (error) {
			console.error("이메일 중복 체크 실패:", error.message);
			showToast({
				message: "이메일 중복 확인 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
				autoCloseTime: 3000,
				iconType: "error",
			});
			onDuplicateCheck?.(null);
			onValidChange?.(false);
			return;
		}

		const isUsed = data;
		onDuplicateCheck?.(isUsed);

		showToast({
			message: isUsed
				? "이미 사용 중인 이메일이에요."
				: "사용 가능한 이메일이에요!",
			autoCloseTime: 3000,
			iconType: isUsed ? "warning" : "success",
		});
	};

	return (
		<div className="flex flex-col relative overflow-hidden">
			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				className="p-2 rounded mt-3 mb-6 backdrop-blur-sm bg-white/10 border border-white/10 shadow-lg"
			>
				<div className="mb-3">
					<AnimatedTextWithIcon fontSize={"text-base"} text={"사용할 이메일을 입력해주세요!"} leftIcon={<MailIcon />} />
				</div>
				<div className="text-sm text-gray-600">
					<AnimatedTextWithIcon fontSize={"text-sm"} text={"입력한 이메일로 가입 인증 메일이 발송돼요!"} delay={0.8} leftIcon={<BulbIcon />} />
				</div>
			</motion.div>

			{/* 이메일 입력 필드 */}
			<motion.div
				variants={fadeSlideLeft}
				initial="hidden"
				animate="visible"
				exit="exit"
				className="flex flex-col items-center space-y-3"
			>
				{/* 이메일 입력 영역 - 한 줄에 모든 요소 */}
				<div className="flex items-center space-x-2 w-full">
					{/* 로컬 파트 입력 */}
					<Input
						type="text"
						name="emailLocal"
						placeholder="이메일 아이디"
						theme={theme}
						className="font text-sm md:text-base w-32"
						value={localPart}
						onChange={handleLocalPartChange}
					/>

					{/* @ 기호 */}
					<span className="text-gray-500 font-medium">@</span>

					{/* 도메인 입력 */}
					<Input
						type="text"
						name="emailDomain"
						placeholder="도메인"
						theme={theme}
						className="font text-sm md:text-base w-40"
						value={domain}
						onChange={handleDomainChange}
					/>

				</div>

				{/* 도메인 드롭다운 */}
				<div className="w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto mt-2">
					{commonDomains.map((domainOption) => (
						<button
							key={domainOption.value}
							onClick={() => handleDomainSelect(domainOption.value)}
							className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
						>
							{domainOption.label}
						</button>
					))}
				</div>

				{/* 중복 검사 버튼 */}
				<Button
					theme={"dark"}
					fontSize={"text-sm"}
					width={"w-24"}
					padding={"py-1.5"}
					onClick={checkDuplicateEmail}
					reverse={theme === "normal"}
					light={theme !== "normal"}
					disabled={checking || isDuplicateEmail === false || !!errorMessage}
					className="font-semibold self-end"
				>
					{checking ? (
						<div className="animate-spin w-4 h-4 border-t-2 border-white rounded-full mx-auto" />
					) : isDuplicateEmail === false ? (
						<div className="flex items-center justify-center">
							<ThumbUpIcon />
						</div>
					) : (
						"중복확인"
					)}
				</Button>
			</motion.div>

			{/* 에러 메시지 */}
			<div className={clsx(
				!touched || !errorMessage ? "opacity-0 translate-y-[-4px]" : "opacity-100 translate-y-0",
				"text-right text-sm min-h-[20px] mt-1",
				"transition-all duration-300 ease-in-out",
				theme === "normal" ? "text-red-600" : "text-red-300"
			)}>
				<div>
					{errorMessage}
				</div>
			</div>
		</div>
	);
};

export default Email;