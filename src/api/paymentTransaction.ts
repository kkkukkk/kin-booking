import { supabase } from '@/lib/supabaseClient';
import { toCamelCaseKeys, toSnakeCaseKeys } from '@/util/case/case';
import { 
	CreatePaymentTransactionDto, 
	UpdatePaymentTransactionDto, 
	FetchPaymentTransactionDto, 
	FetchPaymentTransactionResponseDto,
	PaymentTransactionWithReservationDto,
	FetchPaymentTransactionWithReservationResponseDto
} from '@/types/dto/paymentTransaction';
import { PaymentTransaction } from '@/types/model/paymentTransaction';
import { getPaginationRange } from '@/util/pagination/pagination';

// 거래 이력 생성
export const createPaymentTransaction = async (transaction: CreatePaymentTransactionDto): Promise<PaymentTransaction> => {
	const transactionSnake = toSnakeCaseKeys<CreatePaymentTransactionDto>(transaction);
	const { data, error } = await supabase
		.from('payment_transactions')
		.insert(transactionSnake)
		.select()
		.single();
	
	if (error) throw error;
	return toCamelCaseKeys<PaymentTransaction>(data);
};

// 거래 이력 수정 (필요시)
export const updatePaymentTransaction = async (id: string, transaction: UpdatePaymentTransactionDto): Promise<PaymentTransaction> => {
	const transactionSnake = toSnakeCaseKeys<UpdatePaymentTransactionDto>(transaction);
	const { data, error } = await supabase
		.from('payment_transactions')
		.update(transactionSnake)
		.eq('id', id)
		.select()
		.single();
	
	if (error) throw error;
	return toCamelCaseKeys<PaymentTransaction>(data);
};

// 거래 이력 조회 (기본)
export const fetchPaymentTransactions = async (params?: FetchPaymentTransactionDto): Promise<FetchPaymentTransactionResponseDto> => {
	let query = supabase
		.from('payment_transactions')
		.select('*', { count: 'exact' });
	
	if (params) {
		if (params.id) query = query.eq('id', params.id);
		if (params.reservationId) query = query.eq('reservation_id', params.reservationId);
		if (params.userId) query = query.eq('user_id', params.userId);
		if (params.eventId) query = query.eq('event_id', params.eventId);
		if (params.paymentType) query = query.eq('payment_type', params.paymentType);
		if (params.operatorId) query = query.eq('operator_id', params.operatorId);
		
		// 키워드 검색 (공연명)
		if (params.keyword) {
			query = query.ilike('events.event_name', `%${params.keyword}%`);
		}
		
		// 정렬 적용
		if (params.sortBy) {
			const sortField = params.sortBy === 'operatedAt' ? 'operated_at' : 
							 params.sortBy === 'amount' ? 'amount' :
							 params.sortBy === 'paymentType' ? 'payment_type' : 'operated_at';
			
			query = query.order(sortField, { ascending: params.sortDirection === 'asc' });
		} else {
			// 기본 정렬: 처리일시 최신순
			query = query.order('operated_at', { ascending: false });
		}
		
		// 페이지네이션
		if (params.page && params.size) {
			const range = getPaginationRange(params);
			query = query.range(range.start, range.end);
		}
	}
	
	const { data, count, error } = await query;
	if (error) throw error;
	
	return {
		data: toCamelCaseKeys<PaymentTransaction[]>(data ?? []),
		totalCount: count ?? 0,
	};
};

// 거래 이력 조회 (예매 정보와 함께)
export const fetchPaymentTransactionsWithReservation = async (params?: FetchPaymentTransactionDto): Promise<FetchPaymentTransactionWithReservationResponseDto> => {
	let query = supabase
		.from('payment_transactions')
		.select(`
			*,
			users!payment_transactions_user_id_fkey (
				name
			),
			events!payment_transactions_event_id_fkey (
				event_name
			)
		`, { count: 'exact' });
	
	if (params) {
		if (params.id) query = query.eq('id', params.id);
		if (params.reservationId) query = query.eq('reservation_id', params.reservationId);
		if (params.userId) query = query.eq('user_id', params.userId);
		if (params.eventId) query = query.eq('event_id', params.eventId);
		if (params.paymentType) query = query.eq('payment_type', params.paymentType);
		if (params.operatorId) query = query.eq('operator_id', params.operatorId);
		
		// 키워드 검색 (공연명)
		if (params.keyword) {
			query = query.ilike('events.event_name', `%${params.keyword}%`);
		}
		
		// 날짜 필터링
		if (params.startDate) {
			query = query.gte('operated_at', params.startDate);
		}
		if (params.endDate) {
			query = query.lte('operated_at', params.endDate + 'T23:59:59');
		}
		
		// 정렬 적용
		if (params.sortBy) {
			const sortField = params.sortBy === 'operatedAt' ? 'operated_at' : 
							 params.sortBy === 'amount' ? 'amount' :
							 params.sortBy === 'paymentType' ? 'payment_type' : 'operated_at';
			
			query = query.order(sortField, { ascending: params.sortDirection === 'asc' });
		} else {
			// 기본 정렬: 처리일시 최신순
			query = query.order('operated_at', { ascending: false });
		}
		
		// 페이지네이션
		if (params.page && params.size) {
			const range = getPaginationRange(params);
			query = query.range(range.start, range.end);
		}
	}
	
	const { data, count, error } = await query;
	if (error) throw error;
	
	return {
		data: toCamelCaseKeys<PaymentTransactionWithReservationDto[]>(data ?? []),
		totalCount: count ?? 0,
	};
};

// 특정 예매의 거래 이력 조회
export const fetchPaymentTransactionsByReservationId = async (reservationId: string): Promise<PaymentTransaction[]> => {
	const { data, error } = await supabase
		.from('payment_transactions')
		.select('*')
		.eq('reservation_id', reservationId)
		.order('operated_at', { ascending: false });
	
	if (error) throw error;
	return toCamelCaseKeys<PaymentTransaction[]>(data ?? []);
};

// 특정 사용자의 거래 이력 조회
export const fetchPaymentTransactionsByUserId = async (userId: string): Promise<PaymentTransaction[]> => {
	const { data, error } = await supabase
		.from('payment_transactions')
		.select('*')
		.eq('user_id', userId)
		.order('operated_at', { ascending: false });
	
	if (error) throw error;
	return toCamelCaseKeys<PaymentTransaction[]>(data ?? []);
};
