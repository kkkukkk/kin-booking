import { useQuery } from "@tanstack/react-query";
import { fetchEventById, fetchEvents, fetchEventsWithCurrentStatus } from "@/api/events";
import {
	EventWithCurrentStatus,
	FetchEventDto,
	FetchEventResponseDto,
	FetchEventWithCurrentStatusResponseDto
} from "@/types/dto/events";
import {PaginationParams} from "@/util/pagination/type";

export const useEvents = (params?: PaginationParams & FetchEventDto) => {
	return useQuery<FetchEventResponseDto>({
		queryKey: ['events', params],
		queryFn: () => fetchEvents(params),
		staleTime: 1000 * 60 * 10,
	});
}

export const useEventsWithCurrentStatus = (params?: PaginationParams & FetchEventDto) => {
	return useQuery<FetchEventWithCurrentStatusResponseDto>({
		queryKey: ['events_with_current_status', params],
		queryFn: () => fetchEventsWithCurrentStatus(params),
		staleTime: 1000 * 60 * 10,
		enabled: !!params
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
		staleTime: 1000 * 60 * 10,
	});
};
