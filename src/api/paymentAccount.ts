import { supabase } from "@/lib/supabaseClient";
import { toCamelCaseKeys, toSnakeCaseKeys } from "@/util/case/case";
import { PaymentAccount } from "@/types/model/paymentAccount";
import { 
	CreatePaymentAccountDto, 
	UpdatePaymentAccountDto 
} from "@/types/dto/paymentAccount";

// 활성 입금 계좌 정보 조회 (공개)
export const fetchActivePaymentAccounts = async (): Promise<PaymentAccount[]> => {
	const { data, error } = await supabase
		.from('payment_accounts')
		.select('*')
		.eq('is_active', true)
		.order('sort_order', { ascending: true });

	if (error) throw error;
	return toCamelCaseKeys<PaymentAccount[]>(data ?? []);
};

// 모든 입금 계좌 정보 조회 (관리자용)
export const fetchAllPaymentAccounts = async (): Promise<PaymentAccount[]> => {
	const { data, error } = await supabase
		.from('payment_accounts')
		.select('*')
		.order('sort_order', { ascending: true });

	if (error) throw error;
	return toCamelCaseKeys<PaymentAccount[]>(data ?? []);
};

// 입금 계좌 정보 생성 (관리자용)
export const createPaymentAccount = async (account: CreatePaymentAccountDto): Promise<PaymentAccount> => {
	const accountSnake = toSnakeCaseKeys<CreatePaymentAccountDto>(account);
	const { data, error } = await supabase
		.from('payment_accounts')
		.insert(accountSnake)
		.select()
		.single();

	if (error) throw error;
	return toCamelCaseKeys<PaymentAccount>(data);
};

// 입금 계좌 정보 수정 (관리자용)
export const updatePaymentAccount = async (
	id: string, 
	account: UpdatePaymentAccountDto
): Promise<PaymentAccount> => {
	const accountSnake = toSnakeCaseKeys<UpdatePaymentAccountDto>(account);
	const { data, error } = await supabase
		.from('payment_accounts')
		.update(accountSnake)
		.eq('id', id)
		.select()
		.single();

	if (error) throw error;
	return toCamelCaseKeys<PaymentAccount>(data);
};

// 입금 계좌 정보 삭제 (관리자용)
export const deletePaymentAccount = async (id: string): Promise<void> => {
	const { error } = await supabase
		.from('payment_accounts')
		.delete()
		.eq('id', id);

	if (error) throw error;
};
