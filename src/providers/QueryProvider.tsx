'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

const QueryProvider = ({ children }: { children: ReactNode }) => {
	const [client] = useState(() => new QueryClient())
	return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default QueryProvider