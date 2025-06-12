import { supabase } from "@/lib/supabaseClient";
import { CreateUserDto } from "@/types/dto/user";

export const login = async (email: string, password: string) => {
	const { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password
	});

	if (error) throw error;
	return data;
}

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
			}
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