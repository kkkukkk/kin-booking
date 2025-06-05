'use client'

import { useUsers } from "@/hooks/api/useUsers";
import Card from "@/components/Card";
import {UserWithRoles} from "@/types/dto/user";

const TestPage = () => {
	const { data, error, isLoading } = useUsers({ page: 1, size: 10 })

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	console.log(data);
	const users: UserWithRoles[] = data?.data ?? [];


	return (
		<Card center>
			<h1>Users</h1>
			<ul>
				{users.length === 0 && <li>No users found</li>}
				{users.map((user) => (
					<li key={user.id}>
						{user.name} - {user.email} - {user.phoneNumber} - {user.registerDate?.toString()} - {user.status} - {user.userRoles.roles.roleName}
					</li>
				))}
			</ul>
		</Card>
	)
}

export default TestPage;