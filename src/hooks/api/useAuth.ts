import { useMutation } from '@tanstack/react-query';
import { login, logout, register } from '@/api/auth';
import useToast from '@/hooks/useToast';

export const useLogin = () => {
	const { showToast } = useToast();
	
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
		onError: (error: Error) => {
			console.error('Login error:', error);
			
			// 에러 메시지에 따른 적절한 토스트 메시지 표시
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
			} else {
				showToast({
					message: "로그인 중 오류가 발생했습니다.",
					iconType: "error",
					autoCloseTime: 3000,
				});
			}
		},
	});
};

export const useRegister = () => {
	const { showToast } = useToast();
	
	return useMutation({
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
};

export const useLogout = () => {
	const { showToast } = useToast();
	
	return useMutation({
		mutationFn: logout,
		onError: (error: Error) => {
			console.error('Logout error:', error);
			showToast({
				message: "로그아웃 중 오류가 발생했습니다.",
				iconType: "error",
				autoCloseTime: 3000,
			});
		},
	});
};