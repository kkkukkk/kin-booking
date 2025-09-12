import { supabase } from "@/lib/supabaseClient";
import { CreateUserDto } from "@/types/dto/user";

export const login = async (email: string, password: string) => {
	// 1. 먼저 상태 조회
	const { data: status, error: statusError } = await supabase.rpc('check_user_status_by_email', { p_email: email });

	if (statusError) throw statusError;

	if (!status) {
		throw new Error('Invalid login credentials');
	}

	if (status !== 'active') {
		throw new Error('Account is not active');
	}

	// 2. active면 로그인 진행
	const { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password
	});

	if (error) throw error;

	if (!data.user.email_confirmed_at) {
		await supabase.auth.signOut(); // 자동 로그인 방지
		throw new Error("Email not confirmed");
	}

	return data;
}

// 인증 메일 재전송
export const resendConfirmationEmail = async (email: string) => {
	const { error } = await supabase.auth.resend({
		type: 'signup',
		email: email,
		options: {
			// 회원가입과 동일한 redirect URL 사용
			emailRedirectTo: 'https://kin-booking.vercel.app/auth/callback?source=email',
			//emailRedirectTo: 'http://localhost:3000/auth/callback?source=email',
		}
	});

	if (error) {
		throw error;
	}
	
	return true;
};

export const register = async ({
	email,
	name,
	password,
	phoneNumber,
	marketingConsent,
}: CreateUserDto) => {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				display_name: name,
				phone_number: phoneNumber,
				marketing_consent: marketingConsent,
			},
			// 배포 시 수정
			emailRedirectTo: 'https://kin-booking.vercel.app/auth/callback?source=email',
			//emailRedirectTo: 'http://localhost:3000/auth/callback?source=email',
		}
	});

	if (error) throw error;
	return data;
}

export const logout = async (): Promise<boolean> => {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
	return true;
};