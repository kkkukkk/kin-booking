export interface PaymentAccount {
	id: string;
	bankName: string;
	accountNumber: string;
	accountHolder: string;
	description?: string;
	isActive: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}
