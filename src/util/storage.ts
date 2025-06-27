/**
 * Supabase Storage URL을 생성합니다.
 * @param path Storage 내의 상대 경로
 * @returns 완전한 Storage URL
 */
export const getStorageUrl = (path: string): string => {
	const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
	if (!storageUrl) {
		throw new Error('NEXT_PUBLIC_SUPABASE_STORAGE_URL is not defined');
	}
	return `${storageUrl}/${path}`;
};

/**
 * 공연 포스터 URL을 생성합니다.
 * @param eventId 공연 ID
 * @param filename 파일명 (기본값: poster.jpg)
 * @returns 포스터 이미지 URL
 */
export const getEventPosterUrl = (eventId: string, filename: string = 'poster.jpg'): string => {
	return getStorageUrl(`media/${eventId}/${filename}`);
}; 