export enum UserStatus {
	Active = 'active',     // 활성
	Inactive = 'inactive', // 비활성
	Deleted = 'deleted',   // 삭제됨
}

export const UserStatusKo: Record<UserStatus, string> = {
	[UserStatus.Active]: '활성',
	[UserStatus.Inactive]: '비활성',
	[UserStatus.Deleted]: '삭제',
};

export interface User {
	id: string;
	name: string;
	email: string;
	phoneNumber?: string | null;
	registerDate: string;
	status: UserStatus;
}