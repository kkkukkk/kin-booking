import { UserWithRoles } from '@/types/dto/user';

export const getUserHighestRole = (user: UserWithRoles | null): string => {
	if (!user || !user.userRoles) {
		return 'user';
	}

	// 권한 우선순위: master > manager > member > user
	const rolePriority = {
		'master': 4,
		'manager': 3,
		'member': 2,
		'user': 1,
	};

	const roleCode = user.userRoles.roles?.roleCode?.toLowerCase();
	if (roleCode && rolePriority[roleCode as keyof typeof rolePriority]) {
		return roleCode;
	}

	return 'user';
};

export const getRoleDisplayName = (roleCode: string): string => {
	const roleNames = {
		'master': '마스터',
		'manager': '매니저',
		'member': '멤버',
		'user': '사용자',
	};

	return roleNames[roleCode as keyof typeof roleNames] || '사용자';
};

export const getRoleBadgeColor = (roleCode: string): string => {
	const colors = {
		'master': 'bg-purple-500 text-white',
		'manager': 'bg-blue-500 text-white',
		'member': 'bg-green-500 text-white',
		'user': 'bg-gray-500 text-white',
	};

	return colors[roleCode as keyof typeof colors] || 'bg-gray-500 text-white';
}; 