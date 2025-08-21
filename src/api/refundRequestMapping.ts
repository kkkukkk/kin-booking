import { supabase } from '@/lib/supabaseClient';
import { 
  RefundRequestMapping, 
  CreateRefundRequestMappingRequest 
} from '@/types/model/refundRequestMapping';
import { toCamelCaseKeys } from '@/util/case/case';

// 환불 요청 매핑 생성
export const createRefundRequestMapping = async (request: CreateRefundRequestMappingRequest): Promise<RefundRequestMapping> => {
  const { data, error } = await supabase
    .from('refund_request_mapping')
    .insert([{
      user_id: request.userId,
      refund_account_id: request.refundAccountId,
      reservation_id: request.reservationId,
      event_id: request.eventId
    }])
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<RefundRequestMapping>(data);
};

// 예매 ID로 환불 요청 매핑 조회
export const getRefundRequestMappingByReservation = async (
  reservationId: string,
  userId: string,
  eventId: string
): Promise<RefundRequestMapping | null> => {
  const { data, error } = await supabase
    .from('refund_request_mapping')
    .select('*')
    .eq('reservation_id', reservationId)
    .eq('user_id', userId)
    .eq('event_id', eventId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116: 결과 없음
  return data ? toCamelCaseKeys<RefundRequestMapping>(data) : null;
};

// 사용자 ID로 환불 요청 매핑 목록 조회
export const getRefundRequestMappingsByUserId = async (userId: string): Promise<RefundRequestMapping[]> => {
  const { data, error } = await supabase
    .from('refund_request_mapping')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCaseKeys<RefundRequestMapping[]>(data ?? []);
};
