import { User, UserStatus } from "@/types/model/user";
import { UserRoleStatus } from "@/types/model/userRole";

export interface CreateUserDto {
	name: string;
	password: string;
	email: string;
	phoneNumber: string;
	marketingConsent: boolean;
}

export interface UpdateUserDto {
	status?: UserStatus;
	marketingConsent?: boolean;
	emailVerified?: boolean;
}

export interface FetchUserDto {
	id?: string;
	name?: string;
	email?: string;
	status?: string;
	role?: string;  // 역할 필터 추가
	marketingConsent?: boolean;
	keyword?: string;
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
}

export interface FetchUserResponseDto {
	data: User[];
	totalCount: number;
}

export interface UserWithRoles extends User {
	userRoles: {
		roleId: string;
		roles: {
			roleCode: UserRoleStatus;
			roleName: string;
		};
	};
}

export interface FetchUserWithRolesResponseDto {
	data: UserWithRoles[];
	totalCount: number;
}