import { supabase } from '@/lib/supabaseClient';
import { Ticket, CreateTicketRequest, UpdateTicketRequest, TransferTicketRequest } from '@/types/model/ticket';
import { createTransferHistory } from './ticketTransferHistory';

// 티켓 생성
export const createTicket = async (ticketData: CreateTicketRequest): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('ticket')
    .insert([ticketData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 예약 ID로 티켓 조회
export const getTicketsByReservationId = async (reservationId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('reservation_id', reservationId)
    .in('status', ['active', 'cancelled', 'used']);

  if (error) throw error;
  return data;
};

// 사용자 ID로 티켓 조회
export const getTicketsByOwnerId = async (ownerId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('owner_id', ownerId)
    .in('status', ['active', 'cancelled', 'used'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

// 이벤트 ID로 티켓 조회
export const getTicketsByEventId = async (eventId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('event_id', eventId)
    .in('status', ['active', 'cancelled', 'used']);

  if (error) throw error;
  return data;
};

// 티켓 ID로 티켓 조회
export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('id', ticketId)
    .single();

  if (error) throw error;
  return data;
};

// 티켓 상태 업데이트
export const updateTicket = async (ticketId: string, updateData: UpdateTicketRequest): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('ticket')
    .update(updateData)
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// 티켓 양도 (이력 기록 + 새 active 티켓 생성)
export const transferTicket = async (ticketId: string, transferData: TransferTicketRequest): Promise<Ticket> => {
  // 1. 현재 티켓 정보 조회
  const currentTicket = await getTicketById(ticketId);

  // 2. 기존 티켓 상태를 transferred로 변경
  await updateTicket(ticketId, {
    status: 'transferred',
    transferredAt: new Date().toISOString(),
  });

  // 3. 양도 이력 기록
  await createTransferHistory({
    ticketId: ticketId,
    fromUserId: currentTicket.ownerId,
    toUserId: transferData.newOwnerId,
    reason: transferData.reason || '티켓 양도',
  });

  // 4. 새 active 티켓 생성 (ownerId: 양도받는 사람, eventId/reservationId 등 복사)
  const newTicket = await createTicket({
    reservationId: currentTicket.reservationId,
    eventId: currentTicket.eventId,
    ownerId: transferData.newOwnerId,
    // 필요하다면 qrCode 등 추가 필드 복사
  });

  return newTicket;
};

// 여러 티켓 동시 양도 (각각 새 active 티켓 생성)
export const transferMultipleTickets = async (
  ticketIds: string[], 
  transferData: TransferTicketRequest
): Promise<Ticket[]> => {
  const transferPromises = ticketIds.map(ticketId => 
    transferTicket(ticketId, transferData)
  );
  return Promise.all(transferPromises);
};

// 티켓 삭제 (예약 취소 시)
export const deleteTicket = async (ticketId: string): Promise<void> => {
  const { error } = await supabase
    .from('ticket')
    .delete()
    .eq('id', ticketId);

  if (error) throw error;
};

// 예약 ID로 모든 티켓 삭제
export const deleteTicketsByReservationId = async (reservationId: string): Promise<void> => {
  const { error } = await supabase
    .from('ticket')
    .delete()
    .eq('reservation_id', reservationId);

  if (error) throw error;
}; 