'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import useToast from "@/hooks/useToast";
import useSourceValidation from "@/hooks/useSourceValidation";

const AuthCallbackPage = () => {
	const router = useRouter();
	const { showToast } = useToast();

	useSourceValidation('email');

	useEffect(() => {
		const logoutAfterEmailVerification = async () => {
			// 인증 후 자동 로그인 상태라면 즉시 로그아웃
			await supabase.auth.signOut();

			// 사용자에게 인증 완료 안내 메시지 보여주고 로그인 페이지로 리다이렉트
			showToast({
				message: "이메일 인증이 완료됐어요! 환영합니다!",
				iconType: 'success',
				autoCloseTime: 3000,
			})
			router.replace('/login');
		};

		logoutAfterEmailVerification();
	}, [router, showToast]);

	return null;
};

export default AuthCallbackPage;