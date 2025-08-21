import { User, UserStatus } from "@/types/model/user";

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
}

export interface FetchUserDto {
	id?: string;
	name?: string;
	email?: string;
	phoneNumber?: string;
	status?: string;
	marketingConsent?: boolean;
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
			roleCode: string;
			roleName: string;
		};
	};
}

export interface FetchUserWithRolesResponseDto {
	data: UserWithRoles[];
	totalCount: number;
}