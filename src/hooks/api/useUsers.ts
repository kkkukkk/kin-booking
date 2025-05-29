import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	fetchUser,
	createUser,
	updateUser,
	deleteUser,
	softDeleteUser,
} from '@/api/user';
import { User } from '@/types/model/user';
import {
	CreateUserDto,
	FetchUserDto,
	UpdateUserDto,
	FetchUserWithRolesResponseDto
} from "@/types/dto/user";
import { PaginationParams } from "@/util/pagination/type";

// 유저 검색 hook
export const useUsers = (params?: PaginationParams & FetchUserDto) => {
	return useQuery<FetchUserWithRolesResponseDto, Error>({
		queryKey: ['user', params],
		queryFn: () => fetchUser(params),
		enabled: true,
	});
};

// 유저 생성 hook
export const useCreateUser = () => {
	const queryClient = useQueryClient();

	return useMutation<User, Error, CreateUserDto>({
		mutationFn: createUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: Error) => {
			console.error('사용자 생성 실패:', error.message);
		},
	});
};

// 유저 수정 hook
export const useUpdateUser = () => {
	const queryClient = useQueryClient();

	return useMutation<User, Error, { userId: string; update: UpdateUserDto }>({
		mutationFn: ({ userId, update }) => updateUser(userId, update),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: Error) => {
			console.error('사용자 수정 실패:', error.message);
			//alert(`수정 중 오류 발생: ${error.message}`);
		},
	});
};

// 유저 삭제 hook
export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: (userId: string) => deleteUser(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: Error) => {
			console.error('사용자 삭제 실패:', error.message);
			//alert(`삭제 중 오류 발생: ${error.message}`);
		},
	});
};

// 유저 삭제(상태 변경) hook
export const useSoftDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation<User, Error, string>({
		mutationFn: (userId: string) => softDeleteUser(userId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: Error) => {
			console.error('사용자 삭제(상태 변경) 실패:', error.message);
			//alert(`삭제 중 오류 발생: ${error.message}`);
		},
	});
};
