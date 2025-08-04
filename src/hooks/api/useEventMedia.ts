import { useQuery } from '@tanstack/react-query';
import { fetchEventMedia, fetchEventMediaByType } from '@/api/eventMedia';
import { EventMedia } from '@/types/model/eventMedia';

export const useEventMedia = (eventId: string) => {
	return useQuery<EventMedia[]>({
		queryKey: ['eventMedia', eventId],
		queryFn: () => fetchEventMedia(eventId),
		enabled: !!eventId,
		staleTime: 1000 * 60 * 10,
		retry: 1,
	});
};

export const useEventMediaByType = (eventId: string, mediaType: string) => {
	return useQuery<EventMedia[]>({
		queryKey: ['eventMedia', eventId, mediaType],
		queryFn: () => fetchEventMediaByType(eventId, mediaType),
		enabled: !!eventId && !!mediaType,
		staleTime: 1000 * 60 * 10,
		retry: 1,
	});
};
