import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Session } from "@supabase/auth-js";

export const useSession = () => {
	const [session, setSession] = useState<null | Session>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// 초기 세션 로드
		supabase.auth.getSession().then(({ data }) => {
			setSession(data.session);
			setLoading(false);
		});

		// 리스너 등록
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
			setSession(session);
		});

		// 구독 해제
		return () => subscription.unsubscribe();
	}, []);

	return { session, isLoggedIn: !!session, loading };
};