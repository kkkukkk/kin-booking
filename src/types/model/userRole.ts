// 기존 인터페이스 (나중에 사용할 곳이 있을 수 있음)
export interface UserRole {
	id: string;
	userId: string;
	roleId: string;
}

// 사용자 역할 상태 enum
export enum UserRoleStatus {
	Master = 'master',
	Manager = 'manager',
	Member = 'member',
	User = 'user',
}

export const UserRoleStatusKo: Record<UserRoleStatus, string> = {
	[UserRoleStatus.Master]: '마스터',
	[UserRoleStatus.Manager]: '매니저',
	[UserRoleStatus.Member]: '멤버',
	[UserRoleStatus.User]: '사용자',
};