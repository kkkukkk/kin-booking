import { useMutation } from '@tanstack/react-query';
import { login, logout, register } from '@/api/auth';
import { useRouter } from "next/navigation";

export const useLogin = () => {
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
	});
};

export const useRegister = () => {
	return useMutation({
		mutationFn: register
	});
};

export const useLogout = () => {
	const router = useRouter();

	return useMutation({
		mutationFn: logout,
		onSuccess: () => {
			router.push('/join');
		},
		onError: (error) => {
			console.error(error.message);
		},
	});
};