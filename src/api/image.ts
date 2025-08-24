import { supabase } from "@/lib/supabaseClient";
import { fetchActiveLoginSlideImages } from './appImages';

export const fetchLoginImages = async (): Promise<string[]> => {
	try {
		// 데이터베이스에서 로그인 이미지 조회 시도
		const images = await fetchActiveLoginSlideImages();
		return images.map(image => image.url);
	} catch (error) {
		console.error('데이터베이스에서 로그인 이미지 조회 실패:', error);
		
		// 폴백: 기존 Supabase Storage 방식
		const { data, error: storageError } = await supabase.storage
			.from("kin")
			.list("login-slide", {
				limit: 100,
				offset: 0,
				sortBy: { column: "name", order: "asc" },
			});

		if (storageError) {
			console.error('Storage 조회 오류:', storageError);
			return [];
		}

		const urls = data
			.filter((file: { name?: string }) => file.name)
			.map(
				(file: { name: string }) =>
					`https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/login-slide/${file.name}`
			);
		return urls;
	}
};