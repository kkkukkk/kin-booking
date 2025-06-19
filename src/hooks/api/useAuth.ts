import { useMutation } from '@tanstack/react-query';
import { login, logout, register } from '@/api/auth';


export const useLogin = () => {
	return useMutation({
		mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
		onError: (error) => {
			console.error(error.message);
		}
	});
};

export const useRegister = () => {
	return useMutation({
		mutationFn: register
	});
};

export const useLogout = () => {
	return useMutation({
		mutationFn: logout,
		onError: (error) => {
			console.error(error.message);
		},
	});
};