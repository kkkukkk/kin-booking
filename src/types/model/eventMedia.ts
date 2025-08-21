export type MediaType = 'image' | 'video' | 'audio';

export interface EventMedia {
	id: number;
	eventId: number;
	mediaType: MediaType;
	isActive: boolean;
	uploadedAt: string;
	version: number;
	extension: string;
}