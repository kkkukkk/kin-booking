import { supabase } from '@/lib/supabaseClient';
import { RefundAccount } from '@/types/model/refundAccount';
import { 
	CreateRefundAccountDto, 
	UpdateRefundAccountDto,
} from '@/types/dto/refundAccount';
import { toCamelCaseKeys, toSnakeCaseKeys } from '@/util/case/case';

// 환불 계좌 생성
export const createRefundAccount = async (data: CreateRefundAccountDto): Promise<RefundAccount> => {
	const { data: refundAccount, error } = await supabase
		.from('refund_account')
		.insert(toSnakeCaseKeys(data))
		.select()
		.single();

	if (error) {
		throw new Error(`환불 계좌 생성 실패: ${error.message}`);
	}

	return toCamelCaseKeys<RefundAccount>(refundAccount);
};

// 사용자별 환불 계좌 조회
export const fetchRefundAccountByUserId = async (userId: string): Promise<RefundAccount[]> => {
	const { data: refundAccounts, error } = await supabase
		.from('refund_account')
		.select('*')
		.eq('user_id', userId)
		.order('created_at', { ascending: false });

	if (error) {
		throw new Error(`환불 계좌 조회 실패: ${error.message}`);
	}

	return toCamelCaseKeys<RefundAccount[]>(refundAccounts) || [];
};

// 환불 계좌 수정
export const updateRefundAccount = async (id: string, data: UpdateRefundAccountDto): Promise<RefundAccount> => {
	const { data: refundAccount, error } = await supabase
		.from('refund_account')
		.update(toSnakeCaseKeys(data))
		.eq('id', id)
		.select()
		.single();

	if (error) {
		throw new Error(`환불 계좌 수정 실패: ${error.message}`);
	}

	return toCamelCaseKeys<RefundAccount>(refundAccount);
};

// 환불 계좌 삭제
export const deleteRefundAccount = async (id: string): Promise<void> => {
	const { error } = await supabase
		.from('refund_account')
		.delete()
		.eq('id', id);

	if (error) {
		throw new Error(`환불 계좌 삭제 실패: ${error.message}`);
	}
};
