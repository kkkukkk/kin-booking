import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function Home() {
  const cookieStore = cookies()
  const token = cookieStore.get('kin-access-token')?.value

  if (token) {
    redirect('/dashboard')
  } else {
    redirect('/login')
  }

  return null
}