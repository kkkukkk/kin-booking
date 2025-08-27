import { UserRoleStatus } from './userRole';

export interface Role {
	id: string; // UUID로 변경
	roleCode: UserRoleStatus;
	roleName: string;
	description?: string | null;
}