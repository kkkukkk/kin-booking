import { PaymentTransaction, PaymentType } from '@/types/model/paymentTransaction';

// 거래 이력 생성 DTO
export interface CreatePaymentTransactionDto {
	reservationId: string;
	userId: string;
	eventId: string;
	paymentType: PaymentType;
	amount: number;
	bankName: string;
	accountNumber: string;
	accountHolder: string;
	note?: string;
	operatorId: string;
}

// 거래 이력 수정 DTO (필요시)
export interface UpdatePaymentTransactionDto {
	note?: string;
}

// 거래 이력 조회 DTO
export interface FetchPaymentTransactionDto {
	id?: string;
	reservationId?: string;
	userId?: string;
	eventId?: string;
	paymentType?: PaymentType;
	operatorId?: string;
	page?: number;
	size?: number;
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
}

// 거래 이력 응답 DTO
export interface FetchPaymentTransactionResponseDto {
	data: PaymentTransaction[];
	totalCount: number;
}

// 예매와 함께 조회하는 DTO
export interface PaymentTransactionWithReservationDto extends PaymentTransaction {
	users?: {
		name: string;
	} | null;
	events?: {
		eventName: string;
	} | null;
}

// 예매와 함께 조회하는 응답 DTO
export interface FetchPaymentTransactionWithReservationResponseDto {
	data: PaymentTransactionWithReservationDto[];
	totalCount: number;
}
