import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/auth-js";

export const useSession = () => {
	const [session, setSession] = useState<null | Session>(null);
	const [loading, setLoading] = useState(true);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});

		const { data: { subscription } } = supabase.auth.onAuthStateChange((_, newSession) => {
			// 로그아웃: session이 null로 바뀌는 경우
			if (!newSession) {
				// 기존 세션을 잠깐 유지한 채 일정 시간 후 제거
				timeoutRef.current = setTimeout(() => {
					setSession(null);
				}, 300); // 300ms 버퍼
			} else {
				// 로그인 or 세션 갱신
				if (timeoutRef.current) clearTimeout(timeoutRef.current);
				setSession(newSession);
			}
		});

		return () => {
			subscription.unsubscribe();
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	return {
		session,
		isLoggedIn: !!session,
		loading,
	};
};