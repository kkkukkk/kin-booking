
export const getStorageUrl = (path: string): string => {
	const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL;
	if (!storageUrl) {
		throw new Error('NEXT_PUBLIC_SUPABASE_STORAGE_URL is not defined');
	}
	return `${storageUrl}/${path}`;
};

export const getEventPosterUrl = (eventId: string, version: number = 1, filename: string = 'poster', extension: string = 'jpg'): string => {
    const baseUrl = getStorageUrl(`kin/events/${eventId}/${filename}_v${version}.${extension}`);
    return baseUrl;
}; 