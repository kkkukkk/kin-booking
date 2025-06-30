import { supabase } from '@/lib/supabaseClient';
import { 
  TicketTransferHistory, 
  CreateTransferHistoryRequest, 
  TransferHistoryWithDetails 
} from '@/types/model/ticketTransferHistory';

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
  return data;
};

// 티켓 ID로 양도 이력 조회
export const getTransferHistoryByTicketId = async (ticketId: string): Promise<TicketTransferHistory[]> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .select('*')
    .eq('ticket_id', ticketId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// 사용자 ID로 양도 이력 조회 (받은 티켓)
export const getReceivedTransferHistory = async (userId: string): Promise<TicketTransferHistory[]> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .select('*')
    .eq('to_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// 사용자 ID로 양도 이력 조회 (보낸 티켓)
export const getSentTransferHistory = async (userId: string): Promise<TicketTransferHistory[]> => {
  const { data, error } = await supabase
    .from('ticket_transfer_history')
    .select('*')
    .eq('from_user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
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
  return data;
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
  return data;
}; 