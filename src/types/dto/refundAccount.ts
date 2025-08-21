import { RefundAccount } from '@/types/model/refundAccount';

// 환불 계좌 생성 DTO
export interface CreateRefundAccountDto {
	userId: string;
	bankName: string;
	accountNumber: string;
	accountHolder: string;
}

// 환불 계좌 수정 DTO
export interface UpdateRefundAccountDto {
	bankName?: string;
	accountNumber?: string;
	accountHolder?: string;
}

// 환불 계좌 조회 응답 DTO
export interface FetchRefundAccountResponseDto {
	data: RefundAccount[];
	totalCount: number;
}

// 환불 계좌 단일 조회 응답 DTO
export interface FetchRefundAccountByIdResponseDto {
	data: RefundAccount;
}
