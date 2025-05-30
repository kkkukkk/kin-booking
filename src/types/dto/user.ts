import { User, UserStatus } from "@/types/model/user";

export interface CreateUserDto {
	name: string;
	email: string;
	phoneNumber?: string;
}

export interface UpdateUserDto {
	status: UserStatus;
}

export interface FetchUserDto {
	id?: string;
	name?: string;
	email?: string;
	phoneNumber?: string;
	status?: string;
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