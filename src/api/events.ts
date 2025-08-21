import { PaginationParams } from "@/util/pagination/type";
import {
	CreateEventDto,
	UpdateEventDto,
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
		if (params.status) {
			if (Array.isArray(params.status)) {
			  query = query.in('status', params.status);
			} else {
			  query = query.eq('status', params.status);
			}
		  }
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
		if (params.status) {
			if (Array.isArray(params.status)) {
			  query = query.in('status', params.status);
			} else {
			  query = query.eq('status', params.status);
			}
		  }
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

// events 테이블에서 직접 공연 조회 (수정용)
export const fetchEventFromEventsTable = async (id: string): Promise<Events> => {
	const { data, error } = await supabase
		.from('events')
		.select('*')
		.eq('id', id)
		.single();

	if (error) throw error;
	return toCamelCaseKeys<Events>(data);
};

// 공연 생성
export const createEvent = async (event: CreateEventDto): Promise<Events> => {
	const eventSnake = toSnakeCaseKeys<CreateEventDto>(event);
	const { data, error } = await supabase.from('events').insert(eventSnake).select().single();
	if (error) throw error;
	return toCamelCaseKeys<Events>(data);
};

export const updateEvent = async (id: string, event: UpdateEventDto): Promise<Events> => {
	const eventSnake = toSnakeCaseKeys<UpdateEventDto>(event);
	const { data, error } = await supabase
		.from('events')
		.update(eventSnake)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return toCamelCaseKeys<Events>(data);
};

export const deleteEvent = async (id: string): Promise<void> => {
	// 1. 먼저 관련 포스터 파일을 Storage에서 삭제
	const { data: existingMedia } = await supabase
		.from('event_media')
		.select('url')
		.eq('event_id', id)
		.eq('media_type', 'image')
		.single();

	if (existingMedia) {
		// Storage에서 파일 삭제
		const filePath = existingMedia.url.replace(/^.*\/kin\//, ''); // /kin/ 경로 제거
		const { error: storageError } = await supabase.storage
			.from('kin')
			.remove([filePath]);

		if (storageError) {
			console.error('Storage 파일 삭제 에러:', storageError.message);
			// Storage 삭제 실패해도 공연 삭제는 진행
		}
	}

	// 2. 공연 삭제 (event_media는 cascade로 자동 삭제)
	const { error } = await supabase
		.from('events')
		.delete()
		.eq('id', id);

	if (error) throw error;
};

// 공연 완료 처리
export const completeEvent = async (id: string): Promise<void> => {
    // 1. 공연 상태를 'completed'로 변경
    const { error: updateError } = await supabase
        .from('events')
        .update({ status: 'completed' })
        .eq('id', id);

    if (updateError) throw updateError;

    // 2. 해당 공연의 대기중인 예매 모두 취소
    const { data: pendingReservations, error: fetchError } = await supabase
        .from('reservations')
        .select('id')
        .eq('event_id', id)
        .eq('status', 'pending');

    if (fetchError) throw fetchError;

    // 3. 대기중인 예매가 있으면 모두 취소 처리
    if (pendingReservations && pendingReservations.length > 0) {
        const reservationIds = pendingReservations.map(r => r.id);
        
        const { error: cancelError } = await supabase
            .from('reservations')
            .update({ status: 'voided' })
            .in('id', reservationIds);

        if (cancelError) throw cancelError;
    }

    // 4. 해당 공연의 모든 입장 세션 삭제
    const { error: deleteEntryError } = await supabase
        .from('entry_sessions')
        .delete()
        .eq('event_id', id);

    if (deleteEntryError) throw deleteEntryError;
};