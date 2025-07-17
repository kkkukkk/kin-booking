import { UserWithRoles } from '@/types/dto/user';
import { UserRoleStatus } from '@/types/model/userRole';
import { RoleCodeKo } from '@/types/model/role';

export const getUserHighestRole = (user: UserWithRoles | null): UserRoleStatus => {
	if (!user || !user.userRoles) {
		return UserRoleStatus.User;
	}

	// 권한 우선순위: master > manager > member > user
	const rolePriority = {
		[UserRoleStatus.Master]: 4,
		[UserRoleStatus.Manager]: 3,
		[UserRoleStatus.Member]: 2,
		[UserRoleStatus.User]: 1,
	};

	const roleCode = user.userRoles.roles?.roleCode?.toLowerCase();
	if (roleCode && rolePriority[roleCode as keyof typeof rolePriority]) {
		return roleCode as UserRoleStatus;
	}

	return UserRoleStatus.User;
};

export const getRoleDisplayName = (roleCode: string): string => {
	return RoleCodeKo[roleCode as keyof typeof RoleCodeKo] || '사용자';
};

export const getRoleBadgeColor = (roleCode: string): string => {
	const colors = {
		[UserRoleStatus.Master]: 'bg-purple-500 text-white',
		[UserRoleStatus.Manager]: 'bg-blue-500 text-white',
		[UserRoleStatus.Member]: 'bg-green-500 text-white',
		[UserRoleStatus.User]: 'bg-gray-500 text-white',
	};

	return colors[roleCode as keyof typeof colors] || 'bg-gray-500 text-white';
}; 