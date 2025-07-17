
export const getStorageUrl = (path: string): string => {
	const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
	if (!storageUrl) {
		throw new Error('NEXT_PUBLIC_SUPABASE_STORAGE_URL is not defined');
	}
	return `${storageUrl}/${path}`;
};

export const getEventPosterUrl = (eventId: string, filename: string = 'poster.jpg'): string => {
	return getStorageUrl(`media/${eventId}/${filename}`);
}; 