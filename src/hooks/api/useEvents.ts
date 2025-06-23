import { useQuery } from "@tanstack/react-query";
import { fetchEvents, fetchEventsWithCurrentStatus } from "@/api/events";
import {FetchEventDto, FetchEventResponseDto, FetchEventWithCurrentStatusResponseDto} from "@/types/dto/events";
import {PaginationParams} from "@/util/pagination/type";

export const useEvents = (params?: PaginationParams & FetchEventDto) => {
	return useQuery<FetchEventResponseDto>({
		queryKey: ['events', params],
		queryFn: () => fetchEvents(params),
		staleTime: 1000 * 60 * 10,
	});
}

export const useEventsWithCurrentStatus = (params?: PaginationParams & FetchEventDto) => {
	console.log("called")
	return useQuery<FetchEventWithCurrentStatusResponseDto>({
		queryKey: ['events_with_current_status', params],
		queryFn: () => fetchEventsWithCurrentStatus(params),
		staleTime: 1000 * 60 * 10,
	});
}
