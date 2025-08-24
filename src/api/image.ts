import { supabase } from "@/lib/supabaseClient";
import { fetchActiveLoginSlideImages } from './appImages';

export const fetchLoginImages = async (): Promise<string[]> => {
	try {
		console.log('데이터베이스에서 로그인 이미지 조회 시도...');
		const images = await fetchActiveLoginSlideImages();
		console.log('데이터베이스에서 조회된 이미지:', images);
		return images.map(image => image.url);
	} catch (error) {
		console.error('데이터베이스에서 로그인 이미지 조회 실패:', error);
		console.log('폴백: Supabase Storage에서 이미지 조회 시도...');
		
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

		console.log('Storage에서 조회된 파일들:', data);
		const urls = data
			.filter((file: any) => file.name)
			.map(
				(file: any) =>
					`https://smoemdfpvkatezrsrttu.supabase.co/storage/v1/object/public/kin/login-slide/${file.name}`
			);
		console.log('생성된 URL들:', urls);
		return urls;
	}
};