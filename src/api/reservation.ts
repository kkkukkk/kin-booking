import { PaginationParams } from "@/util/pagination/type";
import { supabase } from "@/lib/supabaseClient";
import { getPaginationRange } from "@/util/pagination/pagination";
import {toCamelCaseKeys, toSnakeCaseKeys} from "@/util/case/case";
import { CreateReservationDto, FetchReservationDto, FetchReservationResponseDto } from "@/types/dto/reservation";
import { Reservation } from "@/types/model/reservation";
import { createTicket, deleteTicketsByReservationId } from "./ticket";
import { getTransferredTicketsByReservation } from "./ticketTransferHistory";

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

export const createReservation = async (reservation: CreateReservationDto): Promise<Reservation> => {
	const reservationSnake = toSnakeCaseKeys<CreateReservationDto>(reservation);
	const { data, error } = await supabase.from('reservations').insert(reservationSnake).select().single();
	if (error) throw error;
	return toCamelCaseKeys<Reservation>(data);
}

export const deleteReservation = async (reservationId: string): Promise<void> => {
	// 먼저 관련 티켓들 삭제
	await deleteTicketsByReservationId(reservationId);
	
	// 그 다음 예약 삭제
	const { error } = await supabase
		.from('reservations')
		.delete()
		.eq('id', reservationId);
		
	if (error) throw error;
};

// 예매 승인 및 티켓 생성
export const approveReservation = async (reservationId: string): Promise<void> => {
	// 1. 예약 상태를 승인으로 변경
	const { data: reservation, error: reservationError } = await supabase
		.from('reservations')
		.update({ status: 'approved' })
		.eq('id', reservationId)
		.select()
		.single();
		
	if (reservationError) throw reservationError;
	
	// 2. 해당 예약에 대한 티켓들 생성
	const ticketPromises = Array.from({ length: reservation.quantity }, () =>
		createTicket({
			reservationId: reservation.id,
			eventId: reservation.event_id,
			ownerId: reservation.user_id,
		})
	);
	
	try {
		await Promise.all(ticketPromises);
	} catch (ticketError) {
		// 티켓 생성 실패 시 예약 상태를 원래대로 되돌림
		await supabase
			.from('reservations')
			.update({ status: 'pending' })
			.eq('id', reservationId);
		throw ticketError;
	}
};

// 예매 거절 (양도된 티켓 고려)
export const safeRejectReservation = async (reservationId: string): Promise<void> => {
	// 1. 양도된 티켓들 확인
	const transferredTickets = await getTransferredTicketsByReservation(reservationId);
	
	// 3. 모든 관련 티켓 삭제 (양도 이력은 CASCADE로 자동 삭제)
	await deleteTicketsByReservationId(reservationId);
	
	// 4. 예약 상태를 거절로 변경
	const { error } = await supabase
		.from('reservations')
		.update({ status: 'rejected' })
		.eq('id', reservationId);
		
	if (error) throw error;
};

// 예매 거절 시 티켓 삭제 (이미 승인된 경우)
export const rejectReservation = async (reservationId: string): Promise<void> => {
	// 먼저 관련 티켓들 삭제 (승인된 예약의 경우)
	await deleteTicketsByReservationId(reservationId);
	
	// 예약 상태를 거절로 변경
	const { error } = await supabase
		.from('reservations')
		.update({ status: 'rejected' })
		.eq('id', reservationId);
		
	if (error) throw error;
};

// 승인 대기 예매 취소
export const cancelPendingReservation = async (reservationId: string): Promise<void> => {
	// 예약 상태 확인
	const { data, error: fetchError } = await supabase
		.from('reservations')
		.select('status')
		.eq('id', reservationId)
		.single();
	if (fetchError) throw fetchError;

	if (!data || data.status !== 'pending') {
		throw new Error('대기중인 예매만 취소할 수 있습니다.');
	}
	// 상태를 cancelled로 변경
	const { error } = await supabase
		.from('reservations')
		.update({ status: 'cancelled' })
		.eq('id', reservationId);
	if (error) throw error;
};