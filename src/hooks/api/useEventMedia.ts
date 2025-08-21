import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEventMedia, fetchEventMediaByType, uploadEventImage, deleteEventMedia, uploadEventPoster, deleteEventPoster } from '@/api/eventMedia';
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

// 이미지 업로드 훅
export const useUploadEventImage = (eventId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (file: File) => uploadEventImage(eventId, file),
		onSuccess: () => {
			// 업로드 성공 시 관련 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['eventMedia', eventId] });
			queryClient.invalidateQueries({ queryKey: ['eventMedia', eventId, 'image'] });
		},
	});
};

// 이미지 삭제 훅
export const useDeleteEventMedia = (eventId: string) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (mediaId: number) => deleteEventMedia(mediaId),
		onSuccess: () => {
			// 삭제 성공 시 관련 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['eventMedia', eventId] });
			queryClient.invalidateQueries({ queryKey: ['eventMedia', eventId, 'image'] });
		},
	});
};

// 공연 등록 후 포스터 업로드 훅
export const useUploadEventPoster = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ eventId, file }: {
			eventId: string;
			file: File;
		}) => uploadEventPoster(eventId, file),
		onSuccess: (_, variables) => {
			// 포스터 업로드 성공 시 관련 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['eventMedia', variables.eventId] });
			queryClient.invalidateQueries({ queryKey: ['eventMediaByType', variables.eventId, 'image'] });
		},
	});
};

export const useDeleteEventPoster = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEventPoster,
		onSuccess: (_, eventId) => {
			// 관련 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['eventMedia', eventId] });
			queryClient.invalidateQueries({ queryKey: ['eventMediaByType', eventId] });
		},
	});
};
