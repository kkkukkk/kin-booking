export enum RoleCode {
	MASTER = 'MASTER',
	MANAGER = 'MANAGER',
	MEMBER = 'MEMBER',
	USER = 'USER',
}

export const RoleCodeKo: Record<RoleCode, string> = {
	[RoleCode.MASTER]: '마스터',
	[RoleCode.MANAGER]: '관리자',
	[RoleCode.MEMBER]: '멤버',
	[RoleCode.USER]: '유저',
};

export interface Role {
	id: number;
	roleCode: RoleCode;
	roleName: string;
	description?: string | null;
}