'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function TestPage() {
	const [users, setUsers] = useState<any[]>([])

	useEffect(() => {
		const fetchUsers = async () => {
			const { data } = await supabase.from('users').select('*')
			setUsers(data ?? [])
		}
		fetchUsers()
	}, [])

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