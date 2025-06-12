'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface SessionContextProps {
	session: Session | null;
	user: User | null;
	isLoggedIn: boolean;
	loading: boolean;
}

const SessionContext = createContext<SessionContextProps>({
	session: null,
	user: null,
	isLoggedIn: false,
	loading: true,
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
	const [session, setSession] = useState<Session | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 1. 초기 세션 불러오기
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});

		// 2. 로그인/로그아웃 상태 변경 감지
		const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
			setSession(session);
		});

		return () => {
			listener?.subscription.unsubscribe();
		};
	}, []);

	return (
		<SessionContext.Provider
			value={{
				session,
				user: session?.user ?? null,
				isLoggedIn: !!session,
				loading,
			}}
		>
			{children}
		</SessionContext.Provider>
	);
};

export const useSessionContext = () => useContext(SessionContext);