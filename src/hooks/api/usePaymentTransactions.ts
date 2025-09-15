import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import {
	createPaymentTransaction,
	updatePaymentTransaction,
	fetchPaymentTransactions,
	fetchPaymentTransactionsWithReservation,
	fetchPaymentTransactionsByReservationId,
	fetchPaymentTransactionsByUserId,
	fetchPaymentTransactionStats
} from '@/api/paymentTransaction';
import {
	UpdatePaymentTransactionDto,
	FetchPaymentTransactionDto
} from '@/types/dto/paymentTransaction';
import { PaginationParams } from '@/util/pagination/type';

// 거래 이력 생성
export const useCreatePaymentTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createPaymentTransaction,
		onSuccess: () => {
			// 거래 이력 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['paymentTransactions'] });
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
		},
		onError: (error: Error) => {
			console.error('거래 이력 생성 실패:', error.message);
		},
	});
};

// 거래 이력 수정
export const useUpdatePaymentTransaction = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdatePaymentTransactionDto }) =>
			updatePaymentTransaction(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['paymentTransactions'] });
		},
		onError: (error: Error) => {
			console.error('거래 이력 수정 실패:', error.message);
		},
	});
};

// 거래 이력 조회 (기본)
export const usePaymentTransactions = (params?: PaginationParams & FetchPaymentTransactionDto) => {
	return useQuery({
		queryKey: ['paymentTransactions', 'admin', params],
		queryFn: () => fetchPaymentTransactions(params),
		retry: 1,
		staleTime: 0,
	});
};

// 거래 이력 조회 (예매 정보와 함께)
export const usePaymentTransactionsWithReservation = (params?: PaginationParams & FetchPaymentTransactionDto) => {
	return useQuery({
		queryKey: ['paymentTransactions', 'withReservation', params],
		queryFn: () => fetchPaymentTransactionsWithReservation(params),
		retry: 1,
		staleTime: 0,
	});
};

// 특정 예매의 거래 이력 조회
export const usePaymentTransactionsByReservationId = (reservationId: string) => {
	return useQuery({
		queryKey: ['paymentTransactions', 'reservation', reservationId],
		queryFn: () => fetchPaymentTransactionsByReservationId(reservationId),
		enabled: !!reservationId,
		retry: 1,
	});
};

// 특정 사용자의 거래 이력 조회
export const usePaymentTransactionsByUserId = (userId: string) => {
	return useQuery({
		queryKey: ['paymentTransactions', 'user', userId],
		queryFn: () => fetchPaymentTransactionsByUserId(userId),
		enabled: !!userId,
		retry: 1,
	});
};

// 전체 거래 통계 조회
export const usePaymentTransactionStats = () => {
	return useQuery({
		queryKey: ['paymentTransactions', 'stats'],
		queryFn: fetchPaymentTransactionStats,
		retry: 1,
		staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
	});
};
