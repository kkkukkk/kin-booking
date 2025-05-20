'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type User = {
	id: string;
	name: string;
	email: string;
	phone_number: string;
	register_date: Date;
}

const TestPage = () => {
	const [users, setUsers] = useState<User[]>([])

	useEffect(() => {
		const fetchUsers = async () => {
			const { data, error } = await supabase.from('users').select('*');
			if (error) {
				console.error(error);
				setUsers([]);
			} else {
				setUsers(data as User[] ?? [])
			}
		}
		fetchUsers();
	}, []);

	return (
		<div>
			<h1>Users</h1>
			<ul>
				{users.map((user) => (
					<li key={user.id}>{user.email}</li>
				))}
			</ul>
		</div>
	)
}

export default TestPage;