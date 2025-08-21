import { PaymentAccount } from "@/types/model/paymentAccount";

export interface CreatePaymentAccountDto {
	bankName: string;
	accountNumber: string;
	accountHolder: string;
	description?: string;
	isActive?: boolean;
	sortOrder?: number;
}

export interface UpdatePaymentAccountDto {
	bankName?: string;
	accountNumber?: string;
	accountHolder?: string;
	description?: string;
	isActive?: boolean;
	sortOrder?: number;
}

export interface FetchPaymentAccountResponseDto {
	data: PaymentAccount[];
	totalCount: number;
}
