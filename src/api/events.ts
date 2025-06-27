import { PaginationParams } from "@/util/pagination/type";
import {
	CreateEventDto,
	EventWithCurrentStatus,
	FetchEventDto,
	FetchEventResponseDto,
	FetchEventWithCurrentStatusResponseDto
} from "@/types/dto/events";
import { supabase } from "@/lib/supabaseClient";
import { getPaginationRange } from "@/util/pagination/pagination";
import { toCamelCaseKeys, toSnakeCaseKeys } from "@/util/case/case";
import { Events } from "@/types/model/events";
import dayjs from "dayjs";

// 공연 조회
export const fetchEvents = async (params?: PaginationParams & FetchEventDto): Promise<FetchEventResponseDto> => {
	let query = supabase.from('events').select('*', { count: 'exact' });
	if (params) {
		if (params.id) query = query.eq('id', params.id);
		if (params.eventName) query = query.ilike('event_name', `%${params.eventName}%`);
		if (params.eventDateFrom) query = query.gte('event_date', params.eventDateFrom);
		if (params.eventDateTo) query = query.lte('event_date', params.eventDateTo);
		if (params.status) query = query.eq('status', params.status);
		if (params.page && params.size) {
			const range = getPaginationRange(params);
			query = query.range(range.start, range.end);
		}
	}
	const { data, count, error } = await query;
	if (error) throw error;

	return {
		data: toCamelCaseKeys<Events[]>(data ?? []),
		totalCount: count ?? 0,
	}
}

export const fetchEventsWithCurrentStatus = async (params?: PaginationParams & FetchEventDto): Promise<FetchEventWithCurrentStatusResponseDto> => {
	let query = supabase.from('event_with_reservation_view').select('*', {count: 'exact'});
	if (params) {
		if (params.id) query = query.eq('event_id', params.id);
		if (params.eventName) query = query.ilike('event_name', `%${params.eventName}%`);
		if (params.eventDateFrom) query = query.gte('event_date', params.eventDateFrom);
		if (params.eventDateTo) {
			// 'to' 날짜 다음 날 00:00:00 미만으로 설정해서 포함 범위 확장
			const adjustedTo = dayjs(params.eventDateTo).add(1, 'day').format('YYYY-MM-DD');
			query = query.lt('event_date', adjustedTo);
		}
		if (params.status) query = query.eq('status', params.status);
		if (params.page && params.size) {
			const range = getPaginationRange(params);
			query = query.range(range.start, range.end);
		}
	}
	const { data, count, error } = await query;
	if (error) throw error;

	return {
		data: toCamelCaseKeys<EventWithCurrentStatus[]>(data ?? []),
		totalCount: count ?? 0,
	}
}

export const fetchEventById = async (id: string): Promise<EventWithCurrentStatus> => {
	const { data } = await fetchEventsWithCurrentStatus({ id });

	if (!data.length) throw new Error("Event not found");

	return data[0];
};

// 공연 생성
export const createEvent = async (event: CreateEventDto): Promise<Events> => {
	const eventSnake = toSnakeCaseKeys<CreateEventDto>(event);
	const { data, error } = await supabase.from('events').insert(eventSnake).single();
	if (error) throw error;
	return toCamelCaseKeys<Events>(data);
}