import { supabase } from "@/lib/supabaseClient";

export const fetchLoginImages = async (): Promise<string[]> => {
	try {
		// 데이터베이스에서 로그인 이미지 조회
		const { data, error } = await supabase
			.from('app_images')
			.select('*')
			.eq('type', 'login_slide')
			.eq('is_active', true)
			.order('order', { ascending: true });

		if (error) {
			console.error('로그인 이미지 조회 실패:', error);
			return [];
		}

		if (data && data.length > 0) {
			return data.map(image => image.url);
		}

		return [];
	} catch (error) {
		console.error('로그인 이미지 조회 중 예외:', error);
		return [];
	}
};