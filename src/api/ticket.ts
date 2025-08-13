import { supabase } from '@/lib/supabaseClient';
import { Ticket } from '@/types/model/ticket';
import { TicketWithEventDto, TicketGroupDto, TicketGroupApiResponse } from '@/types/dto/ticket';
import { toCamelCaseKeys } from '@/util/case/case';

// 예약 ID로 티켓 조회
export const getTicketsByReservationId = async (reservationId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('reservation_id', reservationId)
    .in('status', ['active', 'cancelled', 'used', 'transferred']);

  if (error) throw error;
  return toCamelCaseKeys<Ticket[]>(data ?? []);
};

// 사용자 ID로 티켓 조회
export const getTicketsByOwnerId = async (ownerId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('owner_id', ownerId)
    .in('status', ['active', 'cancelled', 'used', 'transferred'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCaseKeys<Ticket[]>(data ?? []);
};

// 이벤트 ID로 티켓 조회
export const getTicketsByEventId = async (eventId: string): Promise<Ticket[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('event_id', eventId)
    .in('status', ['active', 'cancelled', 'used', 'transferred', 'cancel_requested']);

  if (error) throw error;
  return toCamelCaseKeys<Ticket[]>(data ?? []);
};

// 티켓 ID로 티켓 조회
export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  const { data, error } = await supabase
    .from('ticket')
    .select('*')
    .eq('id', ticketId)
    .single();

  if (error) throw error;
  return toCamelCaseKeys<Ticket>(data ?? []);
};

// 티켓 취소 신청 (단일 티켓)
export const requestCancelTicket = async (ticketId: string, userId: string): Promise<{ updated: boolean }> => {
  const { error } = await supabase
    .from('ticket')
    .update({ status: 'cancel_requested' })
    .eq('id', ticketId)
    .eq('owner_id', userId);
  if (error) throw error;
  return { updated: true };
};

// 취소 신청 승인 (관리자용)
export const approveCancelRequest = async (eventId: string, reservationId: string, ownerId: string): Promise<{ updated: number }> => {
  // 취소할 티켓 수 조회
  const { data: ticketsToCancel, error: countError } = await supabase
    .from('ticket')
    .select('id')
    .eq('event_id', eventId)
    .eq('reservation_id', reservationId)
    .eq('owner_id', ownerId)
    .eq('status', 'cancel_requested');

  if (countError) throw countError;
  if (!ticketsToCancel || ticketsToCancel.length === 0) return { updated: 0 };

  const cancelCount = ticketsToCancel.length;
  const ticketIds = ticketsToCancel.map((t: { id: string }) => t.id);

  // 취소 신청된 티켓들을 cancelled 상태로 변경
  const { error: updateError } = await supabase
    .from('ticket')
    .update({ status: 'cancelled' })
    .in('id', ticketIds);

  if (updateError) throw updateError;
  return { updated: cancelCount };
};

// 티켓 묶음 취소 신청 (특정 예매 그룹만)
export const requestCancelAllTicketsByEvent = async (eventId: string, userId: string, reservationId: string): Promise<{ updated: number }> => {
  // 공연 id + 사용자 id + 예매 id로 활성 상태 티켓들 조회 (특정 예매 그룹만)
  const { data: tickets, error } = await supabase
    .from('ticket')
    .select('id')
    .eq('event_id', eventId)
    .eq('owner_id', userId)
    .eq('reservation_id', reservationId)
    .eq('status', 'active');

  if (error) throw error;
  if (!tickets || tickets.length === 0) return { updated: 0 };

  const activeTicketIds = tickets.map((t: { id: string }) => t.id);
  if (activeTicketIds.length === 0) return { updated: 0 };

  // 해당 예매 그룹의 티켓들만 취소 신청 상태로 변경
  const { error: updateError } = await supabase
    .from('ticket')
    .update({ status: 'cancel_requested' })
    .in('id', activeTicketIds)
    .select();

  if (updateError) throw updateError;
  return { updated: activeTicketIds.length };
};

export const getTicketsWithEventByOwnerId = async (ownerId: string): Promise<TicketWithEventDto[]> => {
  const { data, error } = await supabase
    .from('ticket')
    .select(`*, event:event_id(*)`)
    .eq('owner_id', ownerId)
    .in('status', ['active', 'cancelled', 'used', 'transferred', 'cancel_requested'])
    .order('created_at', { ascending: false });

  if (error) throw error;

  return toCamelCaseKeys<TicketWithEventDto[]>(data ?? []);
};

// 티켓 묶음 조회 (event_id + reservation_id + owner_id로 그룹핑)
export const getTicketGroups = async () => {
  const { data, error } = await supabase
    .from('ticket')
    .select(`
      event_id,
      reservation_id,
      owner_id,
      status,
      created_at,
      event:event_id(event_name),
      user:owner_id(name)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCaseKeys<TicketGroupApiResponse[]>(data ?? []);
};

// 사용자별 티켓 묶음 조회 (event_id + reservation_id + owner_id로 그룹핑)
export const getTicketGroupsByOwnerId = async (ownerId: string) => {
  const { data, error } = await supabase
    .from('ticket')
    .select(`
      event_id,
      reservation_id,
      owner_id,
      status,
      created_at,
      event:event_id(event_name),
      user:owner_id(name)
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return toCamelCaseKeys<TicketGroupApiResponse[]>(data ?? []);
}; 

// 티켓 통계 조회 (관리자용) - 단순 데이터 조회로 변경
export const getAllTicketsForStats = async () => {
  const { data, error } = await supabase
    .from('ticket')
    .select(`
      event_id,
      reservation_id,
      owner_id,
      status,
      events:event_id(event_name),
      users:owner_id(name)
    `);

  if (error) throw error;
  return toCamelCaseKeys<TicketGroupApiResponse[]>(data ?? []);
}; 

// 티켓 양도 (티켓 ID 배열로)
export const transferTickets = async (
  ticketIds: string[],
  toUserId: string,
  fromUserId: string
): Promise<{ transferred: number }> => {
  if (ticketIds.length === 0) {
    throw new Error('양도할 티켓이 선택되지 않았습니다.');
  }

  // 1. 양도할 티켓들이 현재 사용자 소유인지 확인
  const { data: ticketsToTransfer, error: checkError } = await supabase
    .from('ticket')
    .select('id, event_id, reservation_id')
    .in('id', ticketIds)
    .eq('owner_id', fromUserId)
    .eq('status', 'active');

  if (checkError) throw checkError;
  if (!ticketsToTransfer || ticketsToTransfer.length === 0) {
    throw new Error('양도할 수 있는 티켓이 없습니다.');
  }

  if (ticketsToTransfer.length !== ticketIds.length) {
    throw new Error('일부 티켓을 양도할 수 없습니다.');
  }

  // 2. 티켓 소유자 변경 (status는 active 유지)
  const { error: updateError } = await supabase
    .from('ticket')
    .update({ owner_id: toUserId })
    .in('id', ticketIds);

  if (updateError) throw updateError;

  // 3. 양도 이력 기록
  const transferHistoryData = ticketsToTransfer.map(ticket => ({
    ticket_id: ticket.id,
    from_user_id: fromUserId,
    to_user_id: toUserId,
    transferred_at: new Date().toISOString()
  }));

  const { error: historyError } = await supabase
    .from('ticket_transfer_history')
    .insert(transferHistoryData);

  if (historyError) throw historyError;

  return { transferred: ticketsToTransfer.length };
};

// 티켓 양도 (예매 ID로)
export const transferTicketsByReservation = async (
  reservationId: string,
  eventId: string,
  toUserId: string,
  fromUserId: string,
  transferCount: number
): Promise<{ transferred: number }> => {
  // 1. 해당 예매의 활성 티켓들 조회
  const { data: ticketsToTransfer, error: checkError } = await supabase
    .from('ticket')
    .select('id, event_id, reservation_id')
    .eq('reservation_id', reservationId)
    .eq('event_id', eventId)
    .eq('owner_id', fromUserId)
    .eq('status', 'active')
    .limit(transferCount);

  if (checkError) throw checkError;
  if (!ticketsToTransfer || ticketsToTransfer.length === 0) {
    throw new Error('양도할 수 있는 티켓이 없습니다.');
  }

  if (ticketsToTransfer.length < transferCount) {
    throw new Error(`양도할 수 있는 티켓이 부족합니다. (요청: ${transferCount}장, 가능: ${ticketsToTransfer.length}장)`);
  }

  const ticketIds = ticketsToTransfer.map(ticket => ticket.id);

  // 2. 티켓 소유자 변경 (status는 active 유지)
  const { error: updateError } = await supabase
    .from('ticket')
    .update({ owner_id: toUserId })
    .in('id', ticketIds);

  if (updateError) throw updateError;

  // 3. 양도 이력 기록
  const transferHistoryData = ticketsToTransfer.map(ticket => ({
    ticket_id: ticket.id,
    from_user_id: fromUserId,
    to_user_id: toUserId,
    transferred_at: new Date().toISOString()
  }));

  const { error: historyError } = await supabase
    .from('ticket_transfer_history')
    .insert(transferHistoryData);

  if (historyError) throw historyError;

  return { transferred: ticketsToTransfer.length };
}; 

// 티켓 상태 업데이트 (입장확정용)
export const updateTicketStatusByReservation = async (
  eventId: string, 
  reservationId: string, 
  ownerId: string, 
  status: string
): Promise<{ updated: number }> => {
  // 티켓 상태 업데이트 (active + transferred 상태 모두)
  const { error } = await supabase
    .from('ticket')
    .update({ status })
    .eq('event_id', eventId)
    .eq('reservation_id', reservationId)
    .eq('owner_id', ownerId)
    .in('status', ['active', 'transferred']); // 활성 + 양도된 티켓 모두

  if (error) throw error;
  
  return { updated: 1 }; // 성공 시 1 반환
}; 