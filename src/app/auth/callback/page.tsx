'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { updateEmailVerificationStatus } from '@/api/user';
import useToast from "@/hooks/useToast";
import useSourceValidation from "@/hooks/useSourceValidation";

// 이메일 인증 콜백 페이지
const AuthCallbackPage = () => {
	const router = useRouter();
	const { showToast } = useToast();

	useSourceValidation('email');

	useEffect(() => {
		const handleEmailVerification = async () => {
			try {
				// Supabase가 자동으로 생성한 세션 확인
				const { data: { session }, error: sessionError } = await supabase.auth.getSession();
				
				if (sessionError) {
					router.replace('/login');
					return;
				}

				if (session?.user) {
					// 이메일이 인증되었는지 확인
					if (session.user.email_confirmed_at) {
						try {
							await updateEmailVerificationStatus(session.user.id);
						} catch (updateError) {
							console.error('이메일 인증 상태 업데이트 실패:', updateError);
						}
					}
				}

				// 인증 후 자동 로그인 상태라면 즉시 로그아웃
				await supabase.auth.signOut();

				// 사용자에게 인증 완료 안내 메시지 보여주고 로그인 페이지로 리다이렉트
				showToast({
					message: "이메일 인증이 완료됐어요! 환영합니다!",
					iconType: 'success',
					autoCloseTime: 3000,
				})
				router.replace('/login');
			} catch (error) {
				console.error('이메일 인증 처리 중 오류:', error);
				showToast({
					message: "이메일 인증 처리 중 오류가 발생했습니다.",
					iconType: 'error',
					autoCloseTime: 3000,
				});
				router.replace('/login');
			}
		};

		handleEmailVerification();
	}, [router, showToast]);

	return null;
};

export default AuthCallbackPage;