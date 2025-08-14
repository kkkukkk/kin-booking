import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
	fetchActivePaymentAccounts, 
	fetchAllPaymentAccounts,
	createPaymentAccount,
	updatePaymentAccount,
	deletePaymentAccount
} from "@/api/paymentAccount";
import { PaymentAccount } from "@/types/model/paymentAccount";
import { 
	CreatePaymentAccountDto, 
	UpdatePaymentAccountDto 
} from "@/types/dto/paymentAccount";

// 활성 입금 계좌 정보 조회 (공개)
export const useActivePaymentAccounts = () => {
	return useQuery<PaymentAccount[]>({
		queryKey: ['payment_accounts', 'active'],
		queryFn: fetchActivePaymentAccounts,
		staleTime: 1000 * 60 * 5, // 5분
		retry: 1,
	});
};

// 모든 입금 계좌 정보 조회 (관리자용)
export const useAllPaymentAccounts = () => {
	return useQuery<PaymentAccount[]>({
		queryKey: ['payment_accounts', 'all'],
		queryFn: fetchAllPaymentAccounts,
		staleTime: 1000 * 60 * 5, // 5분
		retry: 1,
	});
};

// 입금 계좌 정보 생성 (관리자용)
export const useCreatePaymentAccount = () => {
	const queryClient = useQueryClient();

	return useMutation<PaymentAccount, Error, CreatePaymentAccountDto>({
		mutationFn: createPaymentAccount,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payment_accounts'] });
		},
		onError: (error: Error) => {
			console.error('입금 계좌 생성 실패:', error.message);
		},
	});
};

// 입금 계좌 정보 수정 (관리자용)
export const useUpdatePaymentAccount = () => {
	const queryClient = useQueryClient();

	return useMutation<PaymentAccount, Error, { id: string; data: UpdatePaymentAccountDto }>({
		mutationFn: ({ id, data }) => updatePaymentAccount(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payment_accounts'] });
		},
		onError: (error: Error) => {
			console.error('입금 계좌 수정 실패:', error.message);
		},
	});
};

// 입금 계좌 정보 삭제 (관리자용)
export const useDeletePaymentAccount = () => {
	const queryClient = useQueryClient();

	return useMutation<void, Error, string>({
		mutationFn: deletePaymentAccount,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['payment_accounts'] });
		},
		onError: (error: Error) => {
			console.error('입금 계좌 삭제 실패:', error.message);
		},
	});
};
