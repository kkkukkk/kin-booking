import { useMutation } from '@tanstack/react-query';
import { login, logout, register } from '@/api/auth';
import useToast from '@/hooks/useToast';

export const useLogin = () => {
	const { showToast } = useToast();
	
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
		onError: (error: Error) => {
			// supabase 사용으로 메세지에 의존하여 분기 처리
			if (error.message === "Invalid login credentials") {
				showToast({
					message: "이메일과 비밀번호를 확인해주세요.",
					iconType: "error",
					autoCloseTime: 3000,
				});
			} else if (error.message === "Email not confirmed") {
				showToast({
					message: "이메일 인증 후 로그인할 수 있어요.",
					iconType: "warning",
					autoCloseTime: 3000,
				});
			} else if (error.message === "Account is not active") {
				showToast({
					message: "비활성화(탈퇴 등)된 계정입니다. 관리자에게 문의해주세요.",
					iconType: "error",
					autoCloseTime: 4000,
				});
			} else {
				showToast({
					message: "로그인 중 오류가 발생했습니다.",
					iconType: "error",
					autoCloseTime: 3000,
				});
			}
		},
		retry: false,
	});
};

export const useRegister = () => {
	const { showToast } = useToast();
	
	const mutation = useMutation({
		mutationFn: register,
		onError: (error: Error) => {
			console.error('Register error:', error);
			
			// 에러 메시지에 따른 적절한 토스트 메시지 표시
			if (error.message.includes("already registered")) {
				showToast({
					message: "이미 가입된 이메일입니다.",
					iconType: "error",
					autoCloseTime: 3000,
				});
			} else if (error.message.includes("password")) {
				showToast({
					message: "비밀번호를 확인해주세요.",
					iconType: "error",
					autoCloseTime: 3000,
				});
			} else {
				showToast({
					message: "회원가입 중 오류가 발생했습니다.",
					iconType: "error",
					autoCloseTime: 3000,
				});
			}
		},
	});

	return {
		...mutation,
		mutateAsync: mutation.mutateAsync,
	};
};

export const useLogout = () => {
	const { showToast } = useToast();
	
	return useMutation({
		mutationFn: async () => {
			if (typeof window !== 'undefined') {
				localStorage.setItem('isLoggingOut', '1');
			}
			// 세션 삭제를 200ms 늦춤 (ui 반짝임 방지)
			await new Promise((resolve) => setTimeout(resolve, 200));
			return logout();
		},
		onSuccess: () => {
			// 로그아웃 완료 후 플래그 정리
			if (typeof window !== 'undefined') {
				setTimeout(() => {
					localStorage.removeItem('isLoggingOut');
				}, 1000); // 1초 후 플래그 제거
			}
		},
		onError: (error: Error) => {
			console.error('Logout error:', error);
			// 에러 발생 시에도 플래그 정리
			if (typeof window !== 'undefined') {
				localStorage.removeItem('isLoggingOut');
			}
			showToast({
				message: "로그아웃 중 오류가 발생했습니다.",
				iconType: "error",
				autoCloseTime: 3000,
			});
		},
	});
};