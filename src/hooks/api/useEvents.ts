import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEventById, fetchEvents, fetchEventsWithCurrentStatus, fetchEventFromEventsTable, createEvent, updateEvent, deleteEvent, completeEvent } from "@/api/events";
import {
	EventWithCurrentStatus,
	FetchEventDto,
	FetchEventResponseDto,
	FetchEventWithCurrentStatusResponseDto,
	UpdateEventDto
} from "@/types/dto/events";
import { Events } from "@/types/model/events";
import {PaginationParams} from "@/util/pagination/type";

export const useEvents = (params?: PaginationParams & FetchEventDto) => {
	return useQuery<FetchEventResponseDto>({
		queryKey: ['events', params],
		queryFn: () => fetchEvents(params),
		staleTime: 0,
		retry: 1,
	});
}

export const useEventsWithCurrentStatus = (params?: PaginationParams & FetchEventDto) => {
	return useQuery<FetchEventWithCurrentStatusResponseDto>({
		queryKey: ['events_with_current_status', params],
		queryFn: () => fetchEventsWithCurrentStatus(params),
		staleTime: 0,
		enabled: !!params,
		retry: 1,
	});
}

export const useEventById = (id: string | undefined) => {
	return useQuery<EventWithCurrentStatus>({
		queryKey: ['event_by_id', id],
		queryFn: () => {
			if (!id) throw new Error('id is required');
			return fetchEventById(id);
		},
		enabled: !!id,
		staleTime: 0,
		retry: 1,
	});
};

// Events 모델을 사용하는 단일 공연 조회 훅 (수정용)
export const useEventFromEventsTable = (id: string | undefined) => {
	return useQuery<Events>({
		queryKey: ['event_from_events_table', id],
		queryFn: () => {
			if (!id) throw new Error('id is required');
			return fetchEventFromEventsTable(id);
		},
		enabled: !!id,
		staleTime: 0,
		retry: 1,
	});
};

// 공연 생성 훅
export const useCreateEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createEvent,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
			queryClient.invalidateQueries({ queryKey: ['events_with_current_status'] });
		},
	});
};

export const useUpdateEvent = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, event }: { id: string; event: UpdateEventDto }) => updateEvent(id, event),
        onSuccess: (updatedEvent, variables) => {
            // 이벤트 관련 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ['event_by_id', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['event_from_events_table', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['events_with_current_status'] });
            
            // 포스터 관련 쿼리 즉시 무효화 (버전 기반 시스템으로 캐시 문제 해결)
            queryClient.invalidateQueries({ queryKey: ['eventMedia', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['eventMediaByType', variables.id, 'image'] });
            
            // 모든 eventMedia 관련 쿼리 무효화 (패턴 매칭)
            queryClient.invalidateQueries({ queryKey: ['eventMedia'] });
            queryClient.invalidateQueries({ queryKey: ['eventMediaByType'] });
            
            // 추가: 더 포괄적인 무효화
            queryClient.invalidateQueries({ queryKey: ['eventMedia'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['eventMediaByType'], exact: false });
        },
    });
};

export const useDeleteEvent = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteEvent,
		onSuccess: (_, eventId) => {
			// 개별 공연 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['event_by_id', eventId] });
			queryClient.invalidateQueries({ queryKey: ['event_from_events_table', eventId] });
			// 공연 목록 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['events'] });
			queryClient.invalidateQueries({ queryKey: ['events_with_current_status'] });
		},
	});
};

// 공연 완료 처리 훅
export const useCompleteEvent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: completeEvent,
        onSuccess: (_, eventId) => {
            // 개별 공연 쿼리 무효화
            queryClient.invalidateQueries({ queryKey: ['event_by_id', eventId] });
            queryClient.invalidateQueries({ queryKey: ['event_from_events_table', eventId] });
            // 공연 목록 쿼리들 무효화
            queryClient.invalidateQueries({ queryKey: ['events'] });
            queryClient.invalidateQueries({ queryKey: ['events_with_current_status'] });
            // 예매 관련 쿼리들도 무효화 (상태 변경으로 인해)
            queryClient.invalidateQueries({ queryKey: ['reservations'] });
            queryClient.invalidateQueries({ queryKey: ['reservations_with_event'] });
            // 입장 세션 관련 쿼리들도 무효화 (삭제로 인해)
            queryClient.invalidateQueries({ queryKey: ['entry_sessions'] });
        },
    });
};
