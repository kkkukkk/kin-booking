export type MediaType = 'image' | 'video' | 'audio';

export interface EventMedia {
	id: number;
	eventId: number;
	mediaType: MediaType;
	isActive: boolean;
	uploadedAt: string;
	version: number; // 버전 필드만 유지
	extension: string; // 파일 확장자 추가
}