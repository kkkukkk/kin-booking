import { useQuery } from "@tanstack/react-query";
import { fetchRoles, fetchUserRole } from "@/api/role";
import { Role } from "@/types/model/role";

// 사용자 권한 조회
export const useUserRole = (userId: string) => {
	return useQuery<string>({
		queryKey: ['userRole', userId],
		queryFn: () => fetchUserRole(userId),
		enabled: !!userId,
		retry: 1,
	})
}

// 권한 목록 조회
export const useRoles = () => {
	return useQuery<Role[]>({
		queryKey: ['roles'],
		queryFn: () => fetchRoles(),
		staleTime: 5 * 60 * 1000,
		retry: 1,
	})
}