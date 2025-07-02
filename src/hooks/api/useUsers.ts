import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	fetchUser,
	fetchUserById,
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
		onMutate: async ({ userId, update }) => {
			// 이전 데이터를 저장하기 위해 쿼리 취소
			await queryClient.cancelQueries({ queryKey: ['user', userId] });

			// 이전 데이터 스냅샷 저장
			const previousUser = queryClient.getQueryData(['user', userId]);

			// 낙관적 업데이트
			queryClient.setQueryData(['user', userId], (oldData: any) => {
				if (oldData) {
					return { ...oldData, ...update };
				}
				return oldData;
			});

			// 이전 데이터를 반환하여 롤백에 사용
			return { previousUser };
		},
		onSuccess: (updatedUser, variables) => {
			// 기존 데이터와 서버 응답을 병합하여 캐시 업데이트
			queryClient.setQueryData(['user', variables.userId], (oldData: any) => {
				if (oldData) {
					return { ...oldData, ...updatedUser };
				}
				return updatedUser;
			});
			// 사용자 목록 쿼리 무효화 (목록에서도 변경사항 반영)
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
		onError: (error: Error, variables, context: any) => {
			console.error('사용자 수정 실패:', error.message);
			
			// 실패 시 이전 데이터로 롤백
			if (context?.previousUser) {
				queryClient.setQueryData(['user', variables.userId], context.previousUser);
			}
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

// 특정 유저 조회 hook
export const useUserById = (userId: string) => {
	return useQuery<User | null, Error>({
		queryKey: ['user', userId],
		queryFn: () => fetchUserById(userId),
		enabled: !!userId,
	});
};
