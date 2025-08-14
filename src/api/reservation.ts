import { PaginationParams } from "@/util/pagination/type";
import { supabase } from "@/lib/supabaseClient";
import { getPaginationRange } from "@/util/pagination/pagination";
import {toCamelCaseKeys, toSnakeCaseKeys} from "@/util/case/case";
import { CreateReservationDto, FetchReservationDto, FetchReservationResponseDto, ReservationWithEventDto } from "@/types/dto/reservation";
import { Reservation } from "@/types/model/reservation";
import { generateRandomGradient } from "@/util/adminGradientGenerator";

export const fetchReservation = async (params?: PaginationParams & FetchReservationDto): Promise<FetchReservationResponseDto> => {
	let query = supabase.from('reservations').select('*', { count: 'exact' });
	if (params) {
		if (params.id) query = query.eq('id', params.id);
		if (params.userId) query = query.eq('user_id', params.userId);
		if (params.eventId) query = query.eq('event_id', params.eventId);
		if (params.reservedFrom) query = query.gte('event_date', params.reservedFrom);
		if (params.reservedTo) query = query.lte('event_date', params.reservedTo);
		if (params.status) query = query.eq('status', params.status);
		
		// 정렬 적용
		if (params.sortBy) {
			const sortField = params.sortBy === 'reservedAt' ? 'reserved_at' : 
							 params.sortBy === 'user' ? 'user_id' :
							 params.sortBy === 'event' ? 'event_id' :
							 params.sortBy === 'ticketHolder' ? 'ticket_holder' :
							 params.sortBy === 'quantity' ? 'quantity' :
							 params.sortBy === 'status' ? 'status' : 'reserved_at';
			
			query = query.order(sortField, { ascending: params.sortDirection === 'asc' });
		} else {
			// 기본 정렬: 예매일 최신순
			query = query.order('reserved_at', { ascending: false });
		}
		
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

// 이벤트 정보와 함께 가져오는 함수 (새로 추가)
export const fetchReservationWithEvent = async (params?: PaginationParams & FetchReservationDto): Promise<{ data: ReservationWithEventDto[], totalCount: number }> => {
	let query = supabase
		.from('reservations')
		.select(`
			*,
			events (
				event_name,
				event_date,
				location,
				ticket_price
			)
		`, { count: 'exact' });
	
	if (params) {
		if (params.id) query = query.eq('id', params.id);
		if (params.userId) query = query.eq('user_id', params.userId);
		if (params.eventId) query = query.eq('event_id', params.eventId);
		if (params.reservedFrom) query = query.gte('event_date', params.reservedTo);
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
		data: toCamelCaseKeys<ReservationWithEventDto[]>(data ?? []),
		totalCount: count ?? 0,
	}
}

export const createReservation = async (reservation: CreateReservationDto): Promise<Reservation> => {
	const reservationWithStatus = {
		...reservation,
		status: reservation.status || 'pending'
	};
	const reservationSnake = toSnakeCaseKeys<typeof reservationWithStatus>(reservationWithStatus);
	const { data, error } = await supabase.from('reservations').insert(reservationSnake).select().single();
	if (error) throw error;
	return toCamelCaseKeys<Reservation>(data);
}

export const deleteReservation = async (reservationId: string): Promise<void> => {
	// 예약 삭제 (티켓은 별도 관리)
	const { error } = await supabase
		.from('reservations')
		.delete()
		.eq('id', reservationId);
		
	if (error) throw error;
};

// 예매 확정 및 티켓 생성
export const approveReservation = async (reservationId: string): Promise<void> => {
	// 1. 예약 정보 조회
	const { data: reservation, error: reservationError } = await supabase
		.from('reservations')
		.select('*')
		.eq('id', reservationId)
		.single();
		
	if (reservationError) throw reservationError;
	
	// 2. 이벤트 정보 조회 (ticket_color, seat_capacity 가져오기)
	const { data: event, error: eventError } = await supabase
		.from('events')
		.select('ticket_color, seat_capacity')
		.eq('id', reservation.event_id)
		.single();
		
	if (eventError) throw eventError;
	
	// 3. 좌석 수 미리 체크 (active, cancel_requested 상태 포함)
	const { data: currentTickets, error: countError } = await supabase
		.from('ticket')
		.select('id', { count: 'exact' })
		.eq('event_id', reservation.event_id)
		.in('status', ['active', 'cancel_requested']);
		
	if (countError) throw countError;
	
	const currentTicketCount = currentTickets?.length || 0;
	const availableSeats = event.seat_capacity - currentTicketCount;
	
	if (availableSeats < reservation.quantity) {
		throw new Error(`좌석 수 부족: 요청 ${reservation.quantity}석, 남은 좌석 ${availableSeats}석`);
	}
	
	// 4. Rare 티켓 정보 미리 계산
	const ticketData = [];
	for (let i = 0; i < reservation.quantity; i++) {
		const isRare = Math.random() < 0.05; // 5% 확률
		const color = isRare ? generateRandomGradient() : event.ticket_color;
		
		ticketData.push({
			color,
			is_rare: isRare
		});
	}
	
	// 5. 트랜잭션으로 예매 승인과 티켓 생성 (취소된 티켓 번호 재사용)
	const { error: transactionError } = await supabase.rpc('approve_reservation_safe', {
		p_reservation_id: reservationId,
		p_event_id: reservation.event_id,
		p_user_id: reservation.user_id,
		p_ticket_data: ticketData
	});

	if (transactionError) throw transactionError;
};

// 예매 취소 (대기중인 예매만)
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
	
	// 예약 상태를 voided로 변경
	const { error } = await supabase
		.from('reservations')
		.update({ status: 'voided' })
		.eq('id', reservationId);
		
	if (error) throw error;
};