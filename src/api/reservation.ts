import { PaginationParams } from "@/util/pagination/type";
import { supabase } from "@/lib/supabaseClient";
import { getPaginationRange } from "@/util/pagination/pagination";
import {toCamelCaseKeys, toSnakeCaseKeys} from "@/util/case/case";
import { CreateReservationDto, FetchReservationDto, FetchReservationResponseDto } from "@/types/dto/reservation";
import { Reservation } from "@/types/model/reservation";

export const fetchReservation = async (params?: PaginationParams & FetchReservationDto): Promise<FetchReservationResponseDto> => {
	let query = supabase.from('reservations').select('*', { count: 'exact' });
	if (params) {
		if (params.id) query = query.eq('id', params.id);
		if (params.userId) query = query.eq('user_id', params.userId);
		if (params.eventId) query = query.eq('event_id', params.eventId);
		if (params.reservedFrom) query = query.gte('event_date', params.reservedFrom);
		if (params.reservedTo) query = query.lte('event_date', params.reservedTo);
		if (params.status) query = query.eq('status', params.status);
		if (params.page && params.size) {
			const range = getPaginationRange(params);
			query = query.range(range.start, range.end);
		}
	}
	const { data, count, error } = await query;
	if (error) throw error;

	return {
		data: toCamelCaseKeys<Reservation[]>(data ?? []),
		totalCount: count ?? 0,
	}
}

export const createReservation = async (reservation: CreateReservationDto) => {
	const reservationSnake = toSnakeCaseKeys<CreateReservationDto>(reservation);
	const { data, error } = await supabase.from('reservations').insert(reservationSnake).single();
	if (error) throw error;
	return toCamelCaseKeys(data);
}