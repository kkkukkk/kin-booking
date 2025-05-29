import { supabase } from "@/lib/supabaseClient";
import { toCamelCaseKeys } from "@/util/case/case";
import { Role } from "@/types/model/role";

// 사용자 권한 조회
export const fetchUserRole = async (userId: string): Promise<string> => {
	const { data, error } = await supabase
	.from('user_roles')
	.select(`
      role_id,
      roles (
        role_code
      )
    `)
	.eq('user_id', userId)
	.single();

	if (error) throw error;
	if (!data) throw new Error('User role not found');

	return data?.roles?.[0]?.role_code ?? '';
};

// 권한 목록 조회
export const fetchRoles = async (): Promise<Role[]> => {
	const { data, error } = await supabase
		.from('roles')
		.select('*');
	if (error) throw error;
	return toCamelCaseKeys<Role[]>(data ?? []);
}