import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	createRefundAccount,
	updateRefundAccount,
	deleteRefundAccount,
	fetchRefundAccountByUserId
} from '@/api/refund';
import {
	UpdateRefundAccountDto
} from '@/types/dto/refundAccount';

// 사용자별 환불 계좌 조회
export const useRefundAccountByUserId = (userId: string | undefined) => {
	return useQuery({
		queryKey: ['refund_account', userId],
		queryFn: () => {
			if (!userId) throw new Error('userId is required');
			return fetchRefundAccountByUserId(userId);
		},
		enabled: !!userId,
		staleTime: 5 * 60 * 1000, // 5분
		retry: 1,
	});
};

// 환불 계좌 생성
export const useCreateRefundAccount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createRefundAccount,
		onSuccess: (data) => {
			// 해당 사용자의 환불 계좌 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['refund_account', data.userId] });
		},
	});
};

// 환불 계좌 수정
export const useUpdateRefundAccount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateRefundAccountDto }) =>
			updateRefundAccount(id, data),
		onSuccess: (data) => {
			// 해당 사용자의 환불 계좌 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['refund_account', data.userId] });
		},
	});
};

// 환불 계좌 삭제
export const useDeleteRefundAccount = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteRefundAccount,
		onSuccess: (_, variables) => {
			// 모든 환불 계좌 관련 쿼리 무효화
			queryClient.invalidateQueries({ queryKey: ['refund_account'] });
		},
	});
};
