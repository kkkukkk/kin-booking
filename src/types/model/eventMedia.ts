export type MediaType = 'image' | 'video' | 'audio';

export interface EventMedia {
	id: number;
	eventId: number;
	url: string;
	mediaType: MediaType;
	isActive: boolean;
	uploadedAt: string;
}