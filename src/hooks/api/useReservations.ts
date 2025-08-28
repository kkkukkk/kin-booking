import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Reservation } from "@/types/model/reservation";
import { CreateReservationDto, FetchReservationDto } from "@/types/dto/reservation";
import { createReservation, fetchReservation, fetchReservationWithEvent, cancelPendingReservation, approveReservation } from "@/api/reservation";
import { PaginationParams } from "@/util/pagination/type";

export const useCreateReservation = () => {
	const queryClient = useQueryClient();

	return useMutation<Reservation, Error, CreateReservationDto>({
		mutationFn: createReservation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
		},
		onError: (error: Error) => {
			console.error('reservations 생성 실패:', error.message);
		},
	});
}

// 예매 승인
export const useApproveReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: approveReservation,
		onSuccess: () => {
			// 예매 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['tickets'] });
		},
	});
};

// 예매 거절
export const useRejectReservation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: cancelPendingReservation,
		onSuccess: () => {
			// 예매 관련 쿼리들 무효화
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
			queryClient.invalidateQueries({ queryKey: ['tickets'] });
		},
	});
};

// 사용자별 예매 내역 조회 (이벤트 정보 포함)
export const useReservationsByUserId = (userId: string) => {
	return useQuery({
		queryKey: ['reservations', 'user', userId],
		queryFn: () => fetchReservationWithEvent({ userId }),
		enabled: !!userId,
		retry: 1,
	});
};

// 대기중 예매 취소
export const useCancelPendingReservation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: cancelPendingReservation,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['reservations'] });
		},
	});
};

// 관리자용 전체 예매 조회 (이벤트 정보와 사용자 정보 포함)
export const useReservations = (params?: PaginationParams & FetchReservationDto) => {
	return useQuery({
		queryKey: ['reservations', 'admin', params],
		queryFn: () => fetchReservationWithEvent(params),
		retry: 1,
		staleTime: 0,
	});
};