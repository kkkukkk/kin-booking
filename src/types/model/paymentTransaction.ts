export type PaymentType = 'payment' | 'refund';

export const PaymentTypeKo: Record<PaymentType, string> = {
  payment: '입금',
  refund: '환불',
};

export interface PaymentTransaction {
	id: string;
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
	operatedAt: string;
}
