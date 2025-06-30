export interface RefundRate {
	daysBefore: number; // 며칠 전까지
	rate: number;       // 환불률 (%)
}

export interface RefundPolicy {
	cancelableUntil: number; // 최소 며칠 전까지 취소 가능 (ex. 3일 전)
	refundRates: RefundRate[];
}

export const DEFAULT_REFUND_POLICY: RefundPolicy = {
	cancelableUntil: 1,
	refundRates: [
		{ daysBefore: 5, rate: 100 },
		{ daysBefore: 3, rate: 70 },
		{ daysBefore: 1, rate: 50 },
	],
};