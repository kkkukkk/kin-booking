import { supabase } from '@/lib/supabaseClient';
import { 
  TicketTransferHistory, 
  CreateTransferHistoryRequest, 
  TransferHistoryWithDetails 
} from '@/types/model/ticketTransferHistory';
import { TransferHistoryGroupDto } from '@/types/dto/ticketTransferHistory';
import { toCamelCaseKeys } from '@/util/case/case';

// 양도 이력 생성
export const createTransferHistory = async (historyData: CreateTransferHistoryRequest): Promise<TicketTransferHistory> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .insert([{
      ticket_id: historyData.ticketId,
      from_user_id: historyData.fromUserId,
      to_user_id: historyData.toUserId,
      reason: historyData.reason || null,
    }])
    .select()
    .single();

  if (error) throw error;
  return toCamelCaseKeys<TicketTransferHistory>(data);
};

// 티켓 ID로 양도 이력 조회
export const getTransferHistoryByTicketId = async (ticketId: string): Promise<TicketTransferHistory[]> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCaseKeys<TicketTransferHistory[]>(data ?? []);
};

// 사용자 ID로 양도 이력 조회 (받은 티켓)
export const getReceivedTransferHistory = async (userId: string): Promise<TicketTransferHistory[]> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .select('*')
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCaseKeys<TicketTransferHistory[]>(data ?? []);
};

// 사용자 ID로 양도 이력 조회 (보낸 티켓)
export const getSentTransferHistory = async (userId: string): Promise<TicketTransferHistory[]> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .select('*')
    .eq('from_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCaseKeys<TicketTransferHistory[]>(data ?? []);
};

// 예약 ID로 양도된 티켓들 조회 (롤백용)
export const getTransferredTicketsByReservation = async (reservationId: string): Promise<TransferHistoryWithDetails[]> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .select(`
      *,
      ticket:ticket_id(id, event_id, reservation_id, status)
    `)
    .eq('ticket.reservation_id', reservationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCaseKeys<TransferHistoryWithDetails[]>(data ?? []);
};

// 양도 이력 상세 조회 (사용자 정보 포함)
export const getTransferHistoryWithDetails = async (historyId: string): Promise<TransferHistoryWithDetails> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .select(`
      *,
      ticket:ticket_id(id, event_id, reservation_id, status),
      fromUser:from_user_id(id, name, email),
      toUser:to_user_id(id, name, email)
    `)
    .eq('id', historyId)
    .single();

  if (error) throw error;
  return toCamelCaseKeys<TransferHistoryWithDetails>(data);
};

// 관리자용 전체 양도 이력 조회 (상세 정보 포함)
export const getAllTransferHistoryWithDetails = async (): Promise<TransferHistoryWithDetails[]> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .select(`
      *,
      ticket:ticket_id(id, event_id, reservation_id, status),
      fromUser:from_user_id(id, name, email),
      toUser:to_user_id(id, name, email)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCaseKeys<TransferHistoryWithDetails[]>(data ?? []);
};

// 관리자용 양도 이력 그룹 조회 (뷰 테이블 사용)
export const getAllTransferHistoryGroups = async (
  params: {
    page?: number;
    size?: number;
    startDate?: string;
    endDate?: string;
    keyword?: string;
  } = {}
): Promise<{ data: TransferHistoryGroupDto[]; totalCount: number }> => {
  const { page = 1, size = 10, startDate, endDate, keyword } = params;
  
  let query = supabase
    .from('ticket_transfer_history_group_view')
    .select('*', { count: 'exact' });

  // 키워드 검색 적용 (양도자명, 수령자명, 공연명)
  if (keyword) {
    query = query.or(`from_user_name.ilike.%${keyword}%,to_user_name.ilike.%${keyword}%,event_name.ilike.%${keyword}%`);
  }

  // 날짜 필터 적용
  if (startDate) {
    query = query.gte('group_time', startDate);
  }
  if (endDate) {
    query = query.lte('group_time', endDate + 'T23:59:59');
  }

  // 페이징 적용
  const from = (page - 1) * size;
  const to = from + size - 1;
  
  const { data, error, count } = await query
    .order('group_time', { ascending: false })
    .range(from, to);

  if (error) {
    throw error;
  }
  
  const result = toCamelCaseKeys<TransferHistoryGroupDto[]>(data ?? []);
  return {
    data: result,
    totalCount: count || 0
  };
}; 