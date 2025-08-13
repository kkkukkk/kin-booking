import { supabase } from '@/lib/supabaseClient';
import { User } from '@/types/model/user';
import {
	CreateUserDto,
	FetchUserDto,
	UpdateUserDto,
	FetchUserWithRolesResponseDto, 
	UserWithRoles,
} from '@/types/dto/user';
import { PaginationParams } from "@/util/pagination/type";
import { getPaginationRange } from "@/util/pagination/pagination";
import { toCamelCaseKeys, toSnakeCaseKeys } from "@/util/case/case";

// 유저 검색 api
export const fetchUser = async (params?: PaginationParams & FetchUserDto): Promise<FetchUserWithRolesResponseDto> => {
	let query = supabase
		.from('users')
		.select(
			`
				*,
				user_roles (
			        role_id,
			        roles (
			            role_code,
			            role_name
			        )
			    )
			`,
			{ count: 'exact' }
		);

	if (params) {
		if (params.id) query = query.eq('id', params.id);
		if (params.name) query = query.ilike('name', `%${params.name}%`);
		if (params.email) query = query.ilike('email', `%${params.email}%`);
		if (params.phoneNumber) query = query.eq('phone_number', params.phoneNumber);
		if (params.status) query = query.eq('status', params.status);
		if (params.page && params.size) {
			const range = getPaginationRange(params);
			query = query.range(range.start, range.end);
		}
	}
	const { data, count, error } = await query;
	if (error) throw error;

	return {
		data: toCamelCaseKeys<UserWithRoles[]>(data ?? []),
		totalCount: count ?? 0,
	};
};

// 유저 등록 api
export const createUser = async (user: CreateUserDto): Promise<User> => {
	const userSnake = toSnakeCaseKeys<CreateUserDto>(user);
	const { data, error } = await supabase.from('users').insert(userSnake).single();
	if (error) throw error;
	return toCamelCaseKeys<User>(data);
};

// 유저 수정 api
export const updateUser = async (
	userId: string,
	update: UpdateUserDto
): Promise<User> => {
	const updateSnake = toSnakeCaseKeys<UpdateUserDto>(update);
	const { data, error } = await supabase
	.from('users')
	.update(updateSnake)
	.eq('id', userId)
	.single();

	if (error) throw error;
	return toCamelCaseKeys<User>(data);
};

// 유저 삭제 api
export const deleteUser = async (userId: string): Promise<void> => {
	const { error } = await supabase.from('users').delete().eq('id', userId);
	if (error) throw error;
};

// 유저 삭제(상태 변경) api
export const softDeleteUser = async (userId: string): Promise<User> => {
	const { data, error } = await supabase
	.from('users')
	.update({ status: 'deleted' })
	.eq('id', userId)
	.single();

	if (error) throw error;
	return toCamelCaseKeys<User>(data);
}

// 사용자 역할 변경 api
export const updateUserRole = async (userId: string, newRoleId: number): Promise<void> => {
	const { error } = await supabase
		.from('user_roles')
		.update({ role_id: newRoleId })
		.eq('user_id', userId);
	
	if (error) throw error;
};

// 특정 유저 조회 api
export const fetchUserById = async (userId: string): Promise<UserWithRoles | null> => {
	const { data, error } = await supabase
		.from('users')
		.select(`
			id, 
			name, 
			email, 
			phone_number, 
			register_date, 
			marketing_consent, 
			status,
			user_roles (
				role_id,
				roles (
					role_code,
					role_name
				)
			)
		`)
		.eq('id', userId)
		.eq('status', 'active')
		.single();

	if (error) {
		// 사용자가 존재하지 않는 경우
		if (error.code === 'PGRST116') {
			return null;
		}
		throw error;
	}
	
	return toCamelCaseKeys<UserWithRoles>(data);
};

// 사용자 검색 (친구 추가용 등)
export const searchUsers = async (query: string, currentUserId: string): Promise<User[]> => {
	try {
		const { data, error } = await supabase
			.rpc('search_users_for_friends', {
				search_query: query,
				current_user_id: currentUserId
			});

		if (error) {
			console.error('Search users error:', error);
			return [];
		}
		
		return toCamelCaseKeys<User[]>(data || []);
	} catch (error) {
		console.error('searchUsers error:', error);
		return [];
	}
};