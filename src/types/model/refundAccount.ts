// 환불 계좌 테이블 모델
export interface RefundAccount {
	id: string;
	userId: string;
	bankName: string;
	accountNumber: string;
	accountHolder: string;
	createdAt: string;
}