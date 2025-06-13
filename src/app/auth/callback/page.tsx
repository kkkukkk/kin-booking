'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import useToast from "@/hooks/useToast";

const AuthCallbackPage = () => {
	const router = useRouter();
	const { showToast } = useToast();

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
			router.replace('/join'); // 로그인 페이지
		};

		logoutAfterEmailVerification();
	}, [router, showToast]);

	return null; // 또는 로딩 스피너 등
};

export default AuthCallbackPage;